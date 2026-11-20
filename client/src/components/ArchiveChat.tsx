import { useEffect, useRef, useState } from "react";
import { MessageCircle, Mic, MicOff, Phone, PhoneOff, Send, Volume2, VolumeX, X } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };
type Phase = "idle" | "listening" | "thinking" | "speaking";

const starters = ["¿Qué pasó con Nacho Obes?", "¿Quién tocó en Insoportable?", "¿Qué premios ganó la banda?"];

const phaseText: Record<Phase, string> = {
  idle: "Tocá el micrófono para hablar",
  listening: "Escuchando…",
  thinking: "Pensando…",
  speaking: "Hablando…",
};

// Reconocimiento y lectura en voz del propio navegador (sin costo extra de API).
const SpeechRecognitionImpl: any = typeof window !== "undefined" ? (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition : null;
const canSpeakOut = typeof window !== "undefined" && "speechSynthesis" in window;

function DobermanFace() {
  return (
    <svg className="live-dog" viewBox="0 0 200 200" role="img" aria-label="Doberman">
      <polygon points="46,26 84,72 50,94" fill="#1c1c1e" />
      <polygon points="154,26 116,72 150,94" fill="#1c1c1e" />
      <path d="M100 50 C142 50 160 80 158 118 C156 150 132 174 100 178 C68 174 44 150 42 118 C40 80 58 50 100 50 Z" fill="#1c1c1e" />
      <circle cx="70" cy="132" r="9" fill="#b98a4e" opacity=".75" />
      <circle cx="130" cy="132" r="9" fill="#b98a4e" opacity=".75" />
      <circle cx="72" cy="88" r="7" fill="#b98a4e" />
      <circle cx="128" cy="88" r="7" fill="#b98a4e" />
      <ellipse cx="78" cy="104" rx="9" ry="8" fill="#f2efe8" />
      <ellipse cx="122" cy="104" rx="9" ry="8" fill="#f2efe8" />
      <circle cx="80" cy="105" r="4" fill="#0b0b0c" />
      <circle cx="120" cy="105" r="4" fill="#0b0b0c" />
      <path d="M86 118 C94 114 106 114 114 118 C122 124 122 140 114 148 C106 156 94 156 86 148 C78 140 78 124 86 118 Z" fill="#3a3a3e" />
      <ellipse cx="100" cy="128" rx="9" ry="6" fill="#0b0b0c" />
      <path className="live-mouth" d="M88 152 Q100 160 112 152" stroke="#0b0b0c" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function ArchiveChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const [voiceReplies, setVoiceReplies] = useState(false);
  const [liveMode, setLiveMode] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const recognitionRef = useRef<any>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const liveRef = useRef(false);
  const sendRef = useRef<(text: string) => void>(() => {});
  const startListeningRef = useRef<() => void>(() => {});

  useEffect(() => {
    liveRef.current = liveMode;
  }, [liveMode]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  function speak(text: string) {
    if (!voiceReplies && !liveRef.current) {
      setPhase("idle");
      return;
    }
    if (!canSpeakOut) {
      setPhase("idle");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-UY";
    utterance.onstart = () => setPhase("speaking");
    utterance.onend = () => {
      setPhase("idle");
      if (liveRef.current) startListeningRef.current();
    };
    utterance.onerror = () => setPhase("idle");
    window.speechSynthesis.speak(utterance);
  }

  function startListening() {
    if (!SpeechRecognitionImpl) return;
    window.speechSynthesis?.cancel();
    const recognition = new SpeechRecognitionImpl();
    recognition.lang = "es-UY";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    let heard = false;
    recognition.onresult = (event: any) => {
      const transcript: string = event.results?.[0]?.[0]?.transcript ?? "";
      if (transcript.trim()) {
        heard = true;
        sendRef.current(transcript);
      }
    };
    recognition.onerror = () => {
      setError("No pude escucharte. Revisá el permiso del micrófono.");
      setPhase("idle");
      setListening(false);
    };
    recognition.onend = () => {
      setListening(false);
      setPhase((current) => (current === "listening" ? "idle" : current));
      // En modo live, si no se dijo nada, vuelve a escuchar en vez de quedar parado.
      if (liveRef.current && !heard) setTimeout(() => { if (liveRef.current) startListeningRef.current(); }, 400);
    };
    recognitionRef.current = recognition;
    setError(null);
    setListening(true);
    setPhase("listening");
    recognition.start();
  }
  startListeningRef.current = startListening;

  function toggleListening() {
    if (!SpeechRecognitionImpl) return;
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }
    startListening();
  }

  function toggleLive() {
    if (liveMode) {
      setLiveMode(false);
      recognitionRef.current?.stop();
      window.speechSynthesis?.cancel();
      setPhase("idle");
      return;
    }
    setLiveMode(true);
    setVoiceReplies(true);
    startListening();
  }

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;
    const next: Message[] = [...messages, { role: "user", content }];
    setMessages(next);
    setDraft("");
    setBusy(true);
    setError(null);
    setPhase("thinking");
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await response.json().catch(() => null);
      if (!data) {
        setError(`No pude responder ahora (el servidor devolvió HTTP ${response.status}).`);
        setPhase("idle");
        return;
      }
      if (!response.ok) {
        setError(data.error ?? `No pude responder ahora (HTTP ${response.status}).`);
        setPhase("idle");
        return;
      }
      setMessages([...next, { role: "assistant", content: data.reply }]);
      speak(data.reply);
    } catch {
      setError("No hay conexión con el chat. Probá de nuevo.");
      setPhase("idle");
    } finally {
      setBusy(false);
    }
  }
  sendRef.current = send;

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
              {SpeechRecognitionImpl && (
                <button type="button" onClick={toggleLive} aria-pressed={liveMode} aria-label={liveMode ? "Terminar modo live" : "Iniciar modo live por voz"} title={liveMode ? "Terminar modo live" : "Modo live por voz"}>
                  {liveMode ? <PhoneOff size={16} aria-hidden="true" /> : <Phone size={16} aria-hidden="true" />}
                </button>
              )}
              {canSpeakOut && (
                <button type="button" onClick={() => { setVoiceReplies((on) => !on); window.speechSynthesis.cancel(); }} aria-pressed={voiceReplies} aria-label={voiceReplies ? "Desactivar lectura en voz alta" : "Activar lectura en voz alta"}>
                  {voiceReplies ? <Volume2 size={16} aria-hidden="true" /> : <VolumeX size={16} aria-hidden="true" />}
                </button>
              )}
              <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar chat"><X size={16} aria-hidden="true" /></button>
            </div>
          </header>

          {liveMode ? (
            <div className={`live-stage is-${phase}`} aria-live="polite">
              <div className="live-ring"><DobermanFace /></div>
              <p className="live-status">{phaseText[phase]}</p>
              {error && <p className="chat-panel-error">{error}</p>}
            </div>
          ) : (
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
          )}

          <form className="chat-panel-form" onSubmit={(event) => { event.preventDefault(); send(draft); }}>
            <label className="sr-only" htmlFor="archive-chat-input">Tu pregunta</label>
            <input id="archive-chat-input" value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={1500} placeholder={liveMode ? "Modo live activo: hablá con el micrófono" : "Escribí tu pregunta…"} disabled={busy || liveMode} />
            {SpeechRecognitionImpl && !liveMode && (
              <button type="button" onClick={toggleListening} disabled={busy} aria-label={listening ? "Dejar de escuchar" : "Preguntar por voz"} aria-pressed={listening}>
                {listening ? <MicOff size={16} aria-hidden="true" /> : <Mic size={16} aria-hidden="true" />}
              </button>
            )}
            <button type="submit" disabled={busy || !draft.trim() || liveMode} aria-label="Enviar pregunta"><Send size={16} aria-hidden="true" /></button>
          </form>
          <p className="chat-panel-note">Generado por IA. Puede equivocarse: verificá con las fuentes.</p>
        </section>
      )}
    </>
  );
}
