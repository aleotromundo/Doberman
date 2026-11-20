// Función serverless de Vercel: chat del archivo Doberman con Gemini.
// La clave vive solo en la variable de entorno GEMINI_API_KEY (nunca en el código ni en el navegador).

// Se prueban en orden: si un modelo no existe, no está disponible o da error de cuota, se pasa al siguiente.
// Modelos con nivel gratuito según foros y guías de 2026.
const MODELS = [
  "gemini-3.8-flash",
  "gemini-3.6-flash",
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite",
];
// Recuerda el último modelo que respondió, así no se prueban los que fallan en cada pregunta.
let workingModel: string | null = null;
const MAX_MESSAGES = 10;
const MAX_CHARS = 1500;
const RATE_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT = 20;

// Límite por IP con memoria de la instancia: es de mejor esfuerzo, no un control estricto.
const hits = new Map<string, number[]>();

function allowRequest(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    hits.set(ip, recent);
    return false;
  }
  recent.push(now);
  hits.set(ip, recent);
  return true;
}

let cachedArchive: string | null = null;

// El contexto del archivo se publica como archivo estático junto al sitio (ver scripts/export-archive.ts).
async function buildArchiveContext(req: any): Promise<string> {
  if (cachedArchive) return cachedArchive;
  const host = req.headers?.host ?? "doberman-delta.vercel.app";
  const response = await fetch(`https://${host}/archive-context.json`);
  if (!response.ok) throw new Error(`no se pudo leer el archivo del sitio (HTTP ${response.status})`);
  cachedArchive = await response.text();
  return cachedArchive;
}

// Solo activa la búsqueda web si la pregunta parece pedir datos actuales o fechas.
const NEEDS_WEB = /(hoy|ahora|último|ultimo|última|ultima|próxim|proxim|pr[oó]ximo|siguiente|este año|este mes|reciente|noticia|novedad|show|toque|concierto|gira|fecha|2026|2027|hace poco|actualmente)/i;

function needsWebSearch(messages: ChatMessage[]): boolean {
  const last = messages[messages.length - 1]?.content ?? "";
  return NEEDS_WEB.test(last);
}

async function buildSystemPrompt(req: any): Promise<string> {
  return `Sos el asistente del "Archivo abierto" de Doberman, una banda uruguaya de hard rock de Montevideo.
Respondé siempre en español rioplatense, claro y breve.

Reglas:
- Usá como base el archivo que sigue. Cuando afirmes algo del archivo, indicá la fuente (su URL) si está disponible.
- Si algo no está en el archivo, decilo claramente y no inventes fechas, créditos, formaciones ni datos.
- Distinguí lo confirmado de lo incierto, y mencioná las discrepancias entre fuentes cuando existan.
- Respondé de forma breve y ordenada: 2 a 6 oraciones, o una lista corta si hay varios datos. Solo extendete si la persona pide detalle.
- Cuando cites una fuente, escribí su URL completa para que la persona pueda abrirla.
- Tenés búsqueda web. Usala para datos actuales o que no estén en el archivo, y citá las fuentes con su URL.
- Podés hablar de otros temas, pero dejá en claro cuando una respuesta sale del archivo o de la web.
- No reproduzcas letras de canciones ni fragmentos largos de textos de prensa; resumí con tus palabras.
- No sos la banda ni hablás en su nombre. Si te preguntan por la opinión de los integrantes, aclará que no la tenés.

Archivo (JSON):
${await buildArchiveContext(req)}`;
}

type ChatMessage = { role: "user" | "assistant"; content: string };

function sanitize(input: unknown): ChatMessage[] | null {
  if (!Array.isArray(input)) return null;
  const messages = input
    .filter((item): item is { role: string; content: string } => Boolean(item) && typeof item.content === "string")
    .slice(-MAX_MESSAGES)
    .map((item) => ({
      role: item.role === "assistant" ? ("assistant" as const) : ("user" as const),
      content: item.content.slice(0, MAX_CHARS),
    }));
  if (messages.length === 0 || messages[messages.length - 1].role !== "user") return null;
  return messages;
}

async function handle(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Método no permitido." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: "El chat no está configurado todavía." });
  }

  const ip = String(req.headers["x-forwarded-for"] ?? req.socket?.remoteAddress ?? "anon").split(",")[0].trim();
  if (!allowRequest(ip)) {
    return res.status(429).json({ error: "Llegaste al límite de consultas por hora. Probá más tarde." });
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body ?? {};
  const messages = sanitize(body.messages);
  if (!messages) {
    return res.status(400).json({ error: "Escribí una pregunta para empezar." });
  }

  const useWeb = needsWebSearch(messages);
  const base = {
    systemInstruction: { parts: [{ text: await buildSystemPrompt(req) }] },
    contents: messages.map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content }],
    })),
    generationConfig: { maxOutputTokens: 1200, temperature: 0.4 },
  };
  const withWeb = JSON.stringify({ ...base, tools: [{ google_search: {} }] });
  const withoutWeb = JSON.stringify(base);
  const headers = { "Content-Type": "application/json", "x-goog-api-key": apiKey };

  const order = workingModel ? [workingModel, ...MODELS.filter((m) => m !== workingModel)] : MODELS;
  const failures: string[] = [];

  for (const model of order) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse`;
    let upstream = await fetch(url, { method: "POST", headers, body: useWeb ? withWeb : withoutWeb });
    if (!upstream.ok && useWeb) {
      // Si este modelo no admite búsqueda web, reintenta sin ella.
      upstream = await fetch(url, { method: "POST", headers, body: withoutWeb });
    }
    if (!upstream.ok || !upstream.body) {
      failures.push(`${model}: ${upstream.status}`);
      continue;
    }

    // Respuesta en streaming: el texto llega a medida que se genera.
    workingModel = model;
    res.status(200);
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("X-Content-Type-Options", "nosniff");

    const reader = upstream.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let sentAny = false;
    const webSources = new Map<string, string>();

    const handleEvent = (json: any) => {
      const candidate = json?.candidates?.[0];
      const text: string = (candidate?.content?.parts ?? []).map((part: any) => part.text ?? "").join("");
      if (text) {
        sentAny = true;
        res.write(text);
      }
      for (const chunk of candidate?.groundingMetadata?.groundingChunks ?? []) {
        if (chunk?.web?.uri) webSources.set(chunk.web.uri, chunk.web.title ?? chunk.web.uri);
      }
    };

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let newline: number;
      while ((newline = buffer.indexOf("\n")) >= 0) {
        const line = buffer.slice(0, newline).trim();
        buffer = buffer.slice(newline + 1);
        if (!line.startsWith("data:")) continue;
        try {
          handleEvent(JSON.parse(line.slice(5)));
        } catch {
          // Evento incompleto o malformado: se ignora.
        }
      }
    }

    if (!sentAny) {
      failures.push(`${model}: sin texto`);
      continue;
    }

    if (webSources.size > 0) {
      const list = [...webSources.entries()].slice(0, 5).map(([uri, title]) => `- ${title}: ${uri}`);
      res.write(`\n\nFuentes web:\n${list.join("\n")}`);
    }
    return res.end();
  }

  console.error("Gemini: ningún modelo respondió", failures.join(" | "));
  return res.status(502).json({ error: `No pude responder ahora (${failures[0] ?? "sin respuesta"}). Probá de nuevo en un rato.` });
}

export default async function handler(req: any, res: any) {
  try {
    return await handle(req, res);
  } catch (err: any) {
    console.error("Chat: error inesperado", err);
    return res.status(500).json({ error: `Error interno del chat (${err?.name ?? "error"}: ${String(err?.message ?? "").slice(0, 160)}).` });
  }
}
