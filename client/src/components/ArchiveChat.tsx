import { useRef, useState } from "react";
import { Mic, MicOff, Send, Volume2, VolumeX } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

const starters = ["¿Qué pasó con Nacho Obes?", "¿Quién tocó en Insoportable?", "¿Qué premios ganó la banda?"];

// Reconocimiento y lectura en voz del propio navegador (sin costo extra de API).
const SpeechRecognitionImpl: any = typeof window !== "undefined" ? (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition : null;
const canSpeakOut = typeof window !== "undefined" && "speechSynthesis" in window;

export function ArchiveChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const [voiceReplies, setVoiceReplies] = useState(false);
  const recognitionRef = useRef<any>(null);

  function speak(text: string) {
    if (!voiceReplies || !canSpeakOut) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-UY";
    window.speechSynthesis.speak(utterance);
  }

  function toggleListening() {
    if (!SpeechRecognitionImpl) return;
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }
    const recognition = new SpeechRecognitionImpl();
    recognition.lang = "es-UY";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: any) => {
      const transcript: string = event.results?.[0]?.[0]?.transcript ?? "";
      if (transcript.trim()) send(transcript);
    };
    recognition.onerror = () => setError("No pude escucharte. Revisá el permiso del micrófono.");
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    setError(null);
    setListening(true);
    recognition.start();
  }

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
      speak(data.reply);
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
        {SpeechRecognitionImpl && (
          <button type="button" onClick={toggleListening} disabled={busy} aria-label={listening ? "Dejar de escuchar" : "Preguntar por voz"} aria-pressed={listening}>
            {listening ? <MicOff size={16} aria-hidden="true" /> : <Mic size={16} aria-hidden="true" />}
          </button>
        )}
        <button type="submit" disabled={busy || !draft.trim()} aria-label="Enviar pregunta"><Send size={16} aria-hidden="true" /></button>
      </form>
      {canSpeakOut && (
        <button className="archive-chat-voice" type="button" onClick={() => { setVoiceReplies((on) => !on); if (voiceReplies) window.speechSynthesis.cancel(); }} aria-pressed={voiceReplies}>
          {voiceReplies ? <Volume2 size={14} aria-hidden="true" /> : <VolumeX size={14} aria-hidden="true" />}
          {voiceReplies ? " Leer respuestas en voz alta: activado" : " Leer respuestas en voz alta: desactivado"}
        </button>
      )}
    </section>
  );
}
