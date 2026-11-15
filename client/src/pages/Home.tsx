import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  Disc3,
  ExternalLink,
  Filter,
  Menu,
  Play,
  Search,
  X,
} from "lucide-react";

type Category = "Recitales" | "Entrevistas" | "Videoclips" | "Archivo oficial";
type Confidence = "Confirmado" | "Probable" | "Pendiente";

type VideoRecord = {
  id: string;
  title: string;
  category: Category;
  year: number;
  published: string;
  stage: string;
  place: string;
  source: string;
  duration: string;
  confidence: Confidence;
  songs: string[];
  note: string;
};

const records: VideoRecord[] = [
  {
    id: "xkhSeICzvcQ",
    title: "Show completo — CM Vivo 2002",
    category: "Recitales",
    year: 2002,
    published: "2015",
    stage: "ANIMAL 6 / Combativo",
    place: "CM Vivo",
    source: "Archivo de medio",
    duration: "43:12",
    confidence: "Confirmado",
    songs: ["El nuevo camino del hombre", "Gritemos para no olvidar", "Loco pro"],
    note: "Registro televisivo completo publicado por CM, con fecha del show indicada en la descripción.",
  },
  {
    id: "zkOE6ofhkbI",
    title: "Legado — Official Video",
    category: "Videoclips",
    year: 2025,
    published: "2025",
    stage: "Íntimo extremo / etapa actual",
    place: "Buenos Aires",
    source: "Producción oficial",
    duration: "04:09",
    confidence: "Confirmado",
    songs: ["Legado"],
    note: "Video oficial con producción ejecutiva de Sony Music Argentina. Audio grabado en Romaphonic en octubre de 2024.",
  },
  {
    id: "IxgRlGEaVKo",
    title: "Aura — Video Oficial 2021 (4K)",
    category: "Archivo oficial",
    year: 2021,
    published: "2021",
    stage: "Una razón para seguir",
    place: "Archivo oficial",
    source: "ANIMAL Oficial",
    duration: "03:27",
    confidence: "Confirmado",
    songs: ["Aura"],
    note: "Parte de la videografía remasterizada publicada por el canal oficial.",
  },
  {
    id: "yRJOnusS22I",
    title: "El nuevo camino del hombre — Video Oficial 2021 (4K)",
    category: "Archivo oficial",
    year: 1996,
    published: "2021",
    stage: "El nuevo camino del hombre",
    place: "Archivo oficial",
    source: "ANIMAL Oficial",
    duration: "03:55",
    confidence: "Confirmado",
    songs: ["El nuevo camino del hombre"],
    note: "La ficha conserva el año de publicación en YouTube separado del año histórico de la canción.",
  },
  {
    id: "Q9xrXMIgc0o",
    title: "Esperando el final — Video Oficial 2021 (4K)",
    category: "Archivo oficial",
    year: 1994,
    published: "2021",
    stage: "Fin de un mundo enfermo",
    place: "Archivo oficial",
    source: "ANIMAL Oficial",
    duration: "03:40",
    confidence: "Probable",
    songs: ["Esperando el final"],
    note: "El canal oficial declara que su videografía remasterizada rescata materiales de beta cam y otros archivos.",
  },
  {
    id: "gVygD3zQCPU",
    title: "Entrevista a Andrés Giménez: necesitamos ser felices como banda",
    category: "Entrevistas",
    year: 2024,
    published: "2024",
    stage: "Etapa actual",
    place: "Entrevista audiovisual",
    source: "Medio / entrevista",
    duration: "—",
    confidence: "Probable",
    songs: [],
    note: "Entrevista reciente localizada en YouTube; la fecha exacta del registro requiere ficha editorial propia.",
  },
];

const stages = [
  { year: "1992—1995", title: "Nace el ruido", text: "Del disco homónimo a Fin de un mundo enfermo: identidad, mensaje y el primer salto de formación." },
  { year: "1996—1999", title: "Poder latino", text: "El nuevo camino del hombre, MTV, festivales y la expansión continental de una banda sin permiso." },
  { year: "2001—2006", title: "Combativo", text: "Cambios de sonido, nuevas formaciones y el cierre de la primera gran etapa." },
  { year: "2015—hoy", title: "Una razón para seguir", text: "El regreso, nuevas canciones y una videografía oficial que vuelve a ordenar el archivo." },
];

const categories = ["Todo", "Recitales", "Entrevistas", "Videoclips", "Archivo oficial"] as const;

function confidenceClass(confidence: Confidence) {
  return confidence === "Confirmado" ? "is-confirmed" : confidence === "Probable" ? "is-probable" : "is-pending";
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("Todo");
  const [stage, setStage] = useState("Todas las etapas");
  const [confidence, setConfidence] = useState("Todos los estados");
  const [mobileMenu, setMobileMenu] = useState(false);

  const filteredRecords = useMemo(() => records.filter((record) => {
    const haystack = [record.title, record.category, record.stage, record.place, record.source, ...record.songs].join(" ").toLowerCase();
    return haystack.includes(query.toLowerCase())
      && (category === "Todo" || record.category === category)
      && (stage === "Todas las etapas" || record.stage === stage)
      && (confidence === "Todos los estados" || record.confidence === confidence);
  }), [category, confidence, query, stage]);

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="wordmark" href="#inicio" aria-label="A.N.I.M.A.L. Archivo Audiovisual">
          <span className="wordmark-mark">A/</span>
          <span><b>A.N.I.M.A.L.</b><small>ARCHIVO AUDIOVISUAL</small></span>
        </a>
        <button className="menu-toggle" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Abrir menú">
          {mobileMenu ? <X size={20} /> : <Menu size={20} />}
        </button>
        <nav className={mobileMenu ? "main-nav is-open" : "main-nav"}>
          <a href="#archivo" onClick={() => setMobileMenu(false)}>Archivo</a>
          <a href="#cronologia" onClick={() => setMobileMenu(false)}>Cronología</a>
          <a href="#fuentes" onClick={() => setMobileMenu(false)}>Fuentes</a>
          <a href="https://animal.com.ar/" target="_blank" rel="noreferrer" className="nav-external">Sitio oficial <ExternalLink size={13} /></a>
        </nav>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="hero-video" aria-hidden="true">
            <iframe src="https://www.youtube.com/embed/xkhSeICzvcQ?autoplay=1&mute=1&controls=0&loop=1&playlist=xkhSeICzvcQ&modestbranding=1&rel=0" title="Registro audiovisual de A.N.I.M.A.L." />
          </div>
          <div className="hero-overlay" />
          <div className="hero-noise" />
          <div className="hero-content">
            <div className="eyebrow"><span className="signal-dot" /> ARCHIVO ABIERTO / 1992—2025</div>
            <h1>NO ES<br /><em>NOSTALGIA.</em><br />ES ARCHIVO.</h1>
            <p className="hero-lead">Una cartografía audiovisual de A.N.I.M.A.L.: recitales, entrevistas, videoclips y registros que siguen haciendo ruido.</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#archivo"><Play size={16} fill="currentColor" /> Explorar el archivo</a>
              <a className="button button-ghost" href="#cronologia">Ver cronología <ArrowUpRight size={16} /></a>
            </div>
          </div>
          <div className="hero-foot"><span>BUENOS AIRES / ARGENTINA</span><span className="hero-foot-line" /><span>SEÑAL 01 — EN VIVO</span></div>
        </section>

        <section className="manifesto section-pad">
          <div className="section-kicker">01 / POR QUÉ ESTE ARCHIVO</div>
          <div className="manifesto-grid">
            <h2>La historia no estaba perdida.<br /><span>Estaba dispersa.</span></h2>
            <div className="manifesto-copy"><p>Durante años, la memoria audiovisual de A.N.I.M.A.L. quedó repartida entre canales, archivos de televisión y subidas de fans. Este sitio la reúne, la ordena y la deja abierta para seguir investigando.</p><p className="muted">Cada registro conserva su procedencia y diferencia el año en que fue filmado del día en que apareció en YouTube. Cuando algo no está confirmado, se dice.</p></div>
          </div>
          <div className="stat-strip"><div><strong>159</strong><span>videos en ANIMAL Oficial*</span></div><div><strong>04</strong><span>etapas para recorrer</span></div><div><strong>03</strong><span>niveles de verificación</span></div><small>* cifra visible al consultar el canal, sujeta a cambios.</small></div>
        </section>

        <section className="archive section-pad" id="archivo">
          <div className="archive-heading"><div><div className="section-kicker">02 / REGISTROS SELECCIONADOS</div><h2>El archivo<br /><span>en movimiento.</span></h2></div><p>Una primera capa de material confirmado y localizado. El catálogo crecerá con cada investigación.</p></div>
          <div className="filters-panel">
            <div className="search-field"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar canción, evento, ciudad..." aria-label="Buscar en el archivo" />{query && <button onClick={() => setQuery("")} aria-label="Limpiar búsqueda"><X size={15} /></button>}</div>
            <div className="select-wrap"><Filter size={15} /><select value={stage} onChange={(event) => setStage(event.target.value)}><option>Todas las etapas</option>{Array.from(new Set(records.map((record) => record.stage))).map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={15} /></div>
            <div className="select-wrap"><Check size={15} /><select value={confidence} onChange={(event) => setConfidence(event.target.value)}><option>Todos los estados</option><option>Confirmado</option><option>Probable</option><option>Pendiente</option></select><ChevronDown size={15} /></div>
          </div>
          <div className="category-tabs">{categories.map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div>
          <div className="records-grid">{filteredRecords.map((record, index) => <article className="record-card" key={record.id}><a className="record-thumb" href={`https://www.youtube.com/watch?v=${record.id}`} target="_blank" rel="noreferrer"><img src={`https://i.ytimg.com/vi/${record.id}/hqdefault.jpg`} alt="" /><span className="play-badge"><Play size={16} fill="currentColor" /></span><span className="record-index">0{index + 1}</span></a><div className="record-body"><div className="record-meta"><span className={`confidence ${confidenceClass(record.confidence)}`}>{record.confidence}</span><span>{record.category}</span></div><h3>{record.title}</h3><div className="record-facts"><span><CalendarDays size={13} /> registro {record.year}</span><span><Disc3 size={13} /> publicado {record.published}</span></div><p>{record.note}</p><div className="record-footer"><span>{record.source}</span><a href={`https://www.youtube.com/watch?v=${record.id}`} target="_blank" rel="noreferrer">Ver en YouTube <ArrowUpRight size={14} /></a></div></div></article>)}</div>{filteredRecords.length === 0 && <div className="empty-state"><CircleHelp size={20} /> No encontramos registros con esos filtros. Probá con otra búsqueda.</div>}
        </section>

        <section className="timeline section-pad" id="cronologia">
          <div className="section-kicker">03 / CRONOLOGÍA AUDIOVISUAL</div><div className="timeline-heading"><h2>Cuatro momentos.<br /><span>Un mismo pulso.</span></h2><p>La cronología no reemplaza la investigación histórica: funciona como mapa para volver a cada registro y abrir nuevas preguntas.</p></div>
          <div className="timeline-list">{stages.map((item, index) => <div className="timeline-item" key={item.year}><div className="timeline-rail"><span>0{index + 1}</span><i /></div><div className="timeline-content"><span className="timeline-year">{item.year}</span><h3>{item.title}</h3><p>{item.text}</p><a href="#archivo">Explorar registros <ArrowUpRight size={14} /></a></div></div>)}</div>
        </section>

        <section className="sources section-pad" id="fuentes"><div className="sources-mark">A/</div><div><div className="section-kicker">04 / PROCEDENCIA</div><h2>Un archivo vivo<br /><span>se verifica.</span></h2><p>Este sitio no reemplaza a la banda ni copia sus páginas. Reúne referencias, describe cada pieza y deriva siempre al origen. Los embeds se reservan para reproductores de YouTube; fotos, recortes, notas y páginas externas se consultan desde su fuente original.</p><div className="official-links"><a href="https://animal.com.ar/" target="_blank" rel="noreferrer"><strong>animal.com.ar</strong><span>Web oficial · discos, videos, tour, biografía y tienda</span><ExternalLink size={15} /></a><a href="https://www.youtube.com/channel/UCC8mb3b5v1lDZ90AiGtVrzQ" target="_blank" rel="noreferrer"><strong>YouTube oficial enlazado por la web</strong><span>Canal oficial referido desde animal.com.ar</span><ExternalLink size={15} /></a><a href="https://www.youtube.com/channel/UCHxF_L8DfnvtccfQx2qZbhA" target="_blank" rel="noreferrer"><strong>ANIMAL Oficial</strong><span>Canal con videografía remasterizada · relación editorial a confirmar</span><ExternalLink size={15} /></a></div><div className="legend"><span><i className="legend-dot confirmed" /> Confirmado</span><span><i className="legend-dot probable" /> Probable</span><span><i className="legend-dot pending" /> Pendiente</span></div></div></section>
      </main>

      <footer className="footer"><span>A.N.I.M.A.L. / ARCHIVO AUDIOVISUAL</span><span>HECHO PARA VOLVER A MIRAR</span><a href="#inicio">↑ Arriba</a></footer>
    </div>
  );
}
