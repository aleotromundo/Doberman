import { useEffect, useRef, useState } from "react";
import { MessageCircle, Mic, MicOff, Send, Volume2, VolumeX, X } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

const starters = ["¿Qué pasó con Nacho Obes?", "¿Quién tocó en Insoportable?", "¿Qué premios ganó la banda?"];

// Reconocimiento y lectura en voz del propio navegador (sin costo extra de API).
const SpeechRecognitionImpl: any = typeof window !== "undefined" ? (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition : null;
const canSpeakOut = typeof window !== "undefined" && "speechSynthesis" in window;

export function ArchiveChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const [voiceReplies, setVoiceReplies] = useState(false);
  const recognitionRef = useRef<any>(null);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

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
    <>
      {!open && (
        <button className="chat-fab" type="button" onClick={() => setOpen(true)} aria-expanded={open} aria-controls="archive-chat-panel">
          <MessageCircle size={18} aria-hidden="true" />
          <span>Preguntá</span>
        </button>
      )}

      {open && (
        <section id="archive-chat-panel" className="chat-panel" role="dialog" aria-modal="false" aria-labelledby="archive-chat-title">
          <header className="chat-panel-head">
            <div>
              <strong id="archive-chat-title">Archivo Doberman</strong>
              <span>IA · respuestas con fuentes</span>
            </div>
            <div className="chat-panel-actions">
              {canSpeakOut && (
                <button type="button" onClick={() => { setVoiceReplies((on) => !on); window.speechSynthesis.cancel(); }} aria-pressed={voiceReplies} aria-label={voiceReplies ? "Desactivar lectura en voz alta" : "Activar lectura en voz alta"}>
                  {voiceReplies ? <Volume2 size={16} aria-hidden="true" /> : <VolumeX size={16} aria-hidden="true" />}
                </button>
              )}
              <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar chat"><X size={16} aria-hidden="true" /></button>
            </div>
          </header>

          <div className="chat-panel-log" ref={logRef} aria-live="polite">
            {messages.length === 0 && (
              <div className="chat-panel-intro">
                <p>Hola. Podés preguntarme sobre la banda, los discos, los temas o las fechas. Te respondo con las fuentes del archivo.</p>
                <div className="chat-panel-starters">
                  {starters.map((starter) => (
                    <button key={starter} type="button" onClick={() => send(starter)}>{starter}</button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((message, index) => (
              <div key={index} className={`chat-bubble is-${message.role}`}>{message.content}</div>
            ))}
            {busy && <div className="chat-bubble is-assistant is-typing"><span /><span /><span /></div>}
            {error && <p className="chat-panel-error">{error}</p>}
          </div>

          <form className="chat-panel-form" onSubmit={(event) => { event.preventDefault(); send(draft); }}>
            <label className="sr-only" htmlFor="archive-chat-input">Tu pregunta</label>
            <input id="archive-chat-input" value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={1500} placeholder="Escribí tu pregunta…" disabled={busy} />
            {SpeechRecognitionImpl && (
              <button type="button" onClick={toggleListening} disabled={busy} aria-label={listening ? "Dejar de escuchar" : "Preguntar por voz"} aria-pressed={listening}>
                {listening ? <MicOff size={16} aria-hidden="true" /> : <Mic size={16} aria-hidden="true" />}
              </button>
            )}
            <button type="submit" disabled={busy || !draft.trim()} aria-label="Enviar pregunta"><Send size={16} aria-hidden="true" /></button>
          </form>
          <p className="chat-panel-note">Generado por IA. Puede equivocarse: verificá con las fuentes.</p>
        </section>
      )}
    </>
  );
}
