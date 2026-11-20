// Función serverless de Vercel: chat del archivo Doberman con Gemini.
// La clave vive solo en la variable de entorno GEMINI_API_KEY (nunca en el código ni en el navegador).
import { albums, bandProfile, compilationXX, pressItems, sourceDirectory, timeline } from "../client/src/data/doberman";

// Se prueban en orden: si un modelo no existe, no está disponible o da error de cuota, se pasa al siguiente.
// Primero los nombres verificados en la documentación oficial; después los de la lista original.
const MODELS = [
  "gemini-3.1-flash-lite",
  "gemini-2.5-flash-lite",
  "gemini-3-flash-preview",
  "gemini-2.5-flash",
  "gemini-3-pro",
  "gemini-3-flash-8b",
  "gemini-3-flash",
  "gemini-1.5-flash",
];
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

function buildArchiveContext(): string {
  const data = {
    perfil: bandProfile.map(({ label, text, source }) => ({ tema: label, texto: text, fuente: source.url })),
    discos: albums.map((album) => ({
      titulo: album.title,
      año: album.year,
      nota: album.note,
      confianza: album.confidence,
      formacion: album.lineup,
      creditos: album.credits,
      temas: album.tracks.map((track) => (track.note ? `${track.title} (${track.note})` : track.title)),
    })),
    compilado: { titulo: compilationXX.title, año: compilationXX.year, nota: compilationXX.note, temas: compilationXX.tracks },
    cronologia: timeline.map((item) => ({ año: item.year, titulo: item.title, texto: item.text, fuente: item.source.url })),
    prensa: pressItems.map((item) => ({ titulo: item.title, medio: item.outlet, fecha: item.date, texto: item.text, url: item.url })),
    fuentes: sourceDirectory.flatMap((group) => group.items.map((item) => ({ nombre: item.label, url: item.url }))),
  };
  return JSON.stringify(data);
}

const SYSTEM_PROMPT = `Sos el asistente del "Archivo abierto" de Doberman, una banda uruguaya de hard rock de Montevideo.
Respondé siempre en español rioplatense, claro y breve.

Reglas:
- Usá como base el archivo que sigue. Cuando afirmes algo del archivo, indicá la fuente (su URL) si está disponible.
- Si algo no está en el archivo, decilo claramente y no inventes fechas, créditos, formaciones ni datos.
- Distinguí lo confirmado de lo incierto, y mencioná las discrepancias entre fuentes cuando existan.
- Podés hablar de otros temas, pero dejá en claro cuando una respuesta sale del archivo.
- No reproduzcas letras de canciones ni fragmentos largos de textos de prensa; resumí con tus palabras.
- No sos la banda ni hablás en su nombre. Si te preguntan por la opinión de los integrantes, aclará que no la tenés.

Archivo (JSON):
${buildArchiveContext()}`;

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

export default async function handler(req: any, res: any) {
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

  const payload = JSON.stringify({
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: messages.map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content }],
    })),
    generationConfig: { maxOutputTokens: 800, temperature: 0.4 },
  });

  try {
    const failures: string[] = [];
    for (const model of MODELS) {
      const upstream = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body: payload,
      });
      if (!upstream.ok) {
        failures.push(`${model}: ${upstream.status}`);
        continue;
      }

      const data: any = await upstream.json();
      const reply: string = data?.candidates?.[0]?.content?.parts?.map((part: any) => part.text ?? "").join("") ?? "";
      if (reply.trim()) {
        return res.status(200).json({ reply });
      }
    }
    console.error("Gemini: ningún modelo respondió", failures.join(" | "));
    return res.status(502).json({ error: `No pude responder ahora (${failures[0] ?? "sin respuesta"}). Probá de nuevo en un rato.` });
  } catch (err: any) {
    console.error("Chat: error al llamar a Gemini", err);
    return res.status(502).json({ error: `No pude responder ahora (${err?.name ?? "error"}: ${String(err?.message ?? "").slice(0, 120)}). Probá de nuevo en un rato.` });
  }
}
