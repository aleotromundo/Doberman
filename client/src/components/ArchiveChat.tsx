import { useState } from "react";
import { Send } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

const starters = ["¿Qué pasó con Nacho Obes?", "¿Quién tocó en Insoportable?", "¿Qué premios ganó la banda?"];

export function ArchiveChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;
    const next: Message[] = [...messages, { role: "user", content }];
    setMessages(next);
    setDraft("");
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.error ?? "No pude responder ahora.");
        return;
      }
      setMessages([...next, { role: "assistant", content: data.reply }]);
    } catch {
      setError("No hay conexión con el chat. Probá de nuevo.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="archive-chat section-pad" id="chat" aria-labelledby="archive-chat-title">
      <div className="section-label"><span>01c</span> / PREGUNTALE AL ARCHIVO</div>
      <h2 id="archive-chat-title">Preguntá sobre la banda,<br /><span>los discos y los temas.</span></h2>
      <p className="archive-chat-note">Respuestas generadas por IA a partir del archivo y de conocimiento general. Pueden equivocarse: verificá con las fuentes enlazadas.</p>

      <div className="archive-chat-log" aria-live="polite">
        {messages.length === 0 && (
          <div className="archive-chat-starters">
            {starters.map((starter) => (
              <button key={starter} type="button" onClick={() => send(starter)}>{starter}</button>
            ))}
          </div>
        )}
        {messages.map((message, index) => (
          <p key={index} className={`archive-chat-msg is-${message.role}`}>
            <strong>{message.role === "user" ? "Vos" : "Archivo"}</strong>
            <span>{message.content}</span>
          </p>
        ))}
        {busy && <p className="archive-chat-msg is-assistant"><strong>Archivo</strong><span>Pensando…</span></p>}
        {error && <p className="archive-chat-error">{error}</p>}
      </div>

      <form className="archive-chat-form" onSubmit={(event) => { event.preventDefault(); send(draft); }}>
        <label className="sr-only" htmlFor="archive-chat-input">Tu pregunta</label>
        <input id="archive-chat-input" value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={1500} placeholder="Escribí tu pregunta…" disabled={busy} />
        <button type="submit" disabled={busy || !draft.trim()} aria-label="Enviar pregunta"><Send size={16} aria-hidden="true" /></button>
      </form>
    </section>
  );
}
