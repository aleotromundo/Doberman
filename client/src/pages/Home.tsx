import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  CalendarDays,
  Disc3,
  ExternalLink,
  FileText,
  Menu,
  Music2,
  Play,
  Search,
  X,
} from "lucide-react";
import {
  albums,
  bandProfile,
  compilationXX,
  mediaItems,
  pressItems,
  sourceDirectory,
  sources,
  timeline,
  type SourceLink,
} from "@/data/doberman";
import { discographyQueue } from "@/data/playlist";
import { PlaybackQueuePlayer } from "@/components/PlaybackQueuePlayer";
import { ArchiveChat } from "@/components/ArchiveChat";

const heroVideoId = "wm_2XtoKa1E";
const mediaFilters = ["Todo", "Videoclips", "En vivo", "Álbum completo", "Redes"] as const;
type MediaFilter = (typeof mediaFilters)[number];

function ExternalLinks({ links, className = "source-links" }: { links: SourceLink[]; className?: string }) {
  return (
    <div className={className}>
      {links.map((link) => (
        <a key={`${link.label}-${link.url}`} href={link.url} target="_blank" rel="noreferrer">
          {link.label}<ExternalLink size={13} aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [mediaFilter, setMediaFilter] = useState<MediaFilter>("Todo");
  const [menuOpen, setMenuOpen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [playlistOpen, setPlaylistOpen] = useState(false);
  const [selectedAlbumIndex, setSelectedAlbumIndex] = useState(0);
  const [selectedTrackIndex, setSelectedTrackIndex] = useState(0);
  const [selectionRequestId, setSelectionRequestId] = useState(0);
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!playlistOpen) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const dialog = dialogRef.current;
    dialog?.querySelector<HTMLElement>(".playlist-close")?.focus();
    const handleDialogKeys = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPlaylistOpen(false);
        return;
      }
      if (event.key !== "Tab" || !dialog) return;
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), iframe, summary, [tabindex]:not([tabindex='-1'])"));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", handleDialogKeys);
    return () => {
      window.removeEventListener("keydown", handleDialogKeys);
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [playlistOpen]);

  const filteredAlbums = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("es");
    if (!normalized) return albums;
    return albums.filter((album) =>
      [album.title, album.year, album.era, album.note, ...album.tracks.map((track) => track.title)]
        .join(" ")
        .toLocaleLowerCase("es")
        .includes(normalized),
    );
  }, [query]);

  const filteredMedia = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("es");
    return mediaItems.filter((item) => {
      const matchesText = !normalized || [item.title, item.type, item.year, item.description, item.sourceLabel]
        .join(" ").toLocaleLowerCase("es").includes(normalized);
      return matchesText && (mediaFilter === "Todo" || item.category === mediaFilter);
    });
  }, [mediaFilter, query]);

  const closeMenu = () => setMenuOpen(false);
  const trackTotal = albums.reduce((sum, album) => sum + album.trackCount, 0);
  const queueTotal = discographyQueue.reduce((sum, album) => sum + album.trackCount, 0);
  const selectedAlbum = discographyQueue[selectedAlbumIndex];
  const chooseAlbum = (index: number) => {
    const boundedIndex = Math.max(0, Math.min(discographyQueue.length - 1, index));
    setSelectedAlbumIndex(boundedIndex);
    setSelectedTrackIndex(0);
    setSelectionRequestId((requestId) => requestId + 1);
  };
  const openTrack = (albumIndex: number, trackIndex: number) => {
    const boundedAlbumIndex = Math.max(0, Math.min(discographyQueue.length - 1, albumIndex));
    setSelectedAlbumIndex(boundedAlbumIndex);
    setSelectedTrackIndex(trackIndex);
    setSelectionRequestId((requestId) => requestId + 1);
    setPlaylistOpen(true);
  };
  const chooseTrack = (trackIndex: number) => {
    setSelectedTrackIndex(trackIndex);
    setSelectionRequestId((requestId) => requestId + 1);
  };
  const advanceBlock = () => {
    if (selectedAlbumIndex < discographyQueue.length - 1) chooseAlbum(selectedAlbumIndex + 1);
  };
  const startPlaylist = () => {
    chooseAlbum(0);
    setPlaylistOpen(true);
  };

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="wordmark" href="#inicio" aria-label="Doberman, volver al inicio">
          <span className="wordmark-mark">D/</span>
          <span className="wordmark-text"><strong>DOBERMAN</strong><small>ARCHIVO ABIERTO</small></span>
        </a>
        <button className="menu-toggle" type="button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"} aria-expanded={menuOpen}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <nav className={menuOpen ? "main-nav is-open" : "main-nav"} aria-label="Navegación principal">
          <a href="#discografia" onClick={closeMenu}>Discografía</a>
          <a href="#archivo" onClick={closeMenu}>Archivo</a>
          <a href="#cronologia" onClick={closeMenu}>Cronología</a>
          <a href="#prensa" onClick={closeMenu}>Prensa</a>
          <a href="#fuentes" onClick={closeMenu}>Fuentes</a>
        </nav>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="hero-poster" aria-hidden="true" />
          {!reducedMotion && (
            <div className="hero-video" aria-hidden="true">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${heroVideoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${heroVideoId}&playsinline=1&rel=0&modestbranding=1`}
                title="Doberman — Blanco Perfecto, video de archivo"
                allow="autoplay; encrypted-media; picture-in-picture"
                referrerPolicy="strict-origin-when-cross-origin"
                tabIndex={-1}
              />
            </div>
          )}
          <div className="hero-shade" />
          <div className="hero-grain" aria-hidden="true" />
          <div className="hero-content">
            <p className="eyebrow"><span className="status-dot" /> MONTEVIDEO, URUGUAY · HARD ROCK</p>
            <h1>DOBERMAN</h1>
            <p className="hero-subtitle">El ruido quedó registrado.</p>
            <p className="hero-lead">Cuatro discos. Cada tema, con su rastro. Un archivo independiente para volver a escuchar y encontrar la historia dispersa de la banda.</p>
            <div className="hero-actions">
              <button className="button button-primary" type="button" onClick={startPlaylist}><Play size={16} fill="currentColor" /> Reproducir catálogo · {queueTotal} cortes</button>
              <a className="button button-quiet" href="#archivo"><Play size={15} /> Ver archivo audiovisual</a>
            </div>
            <a className="hero-credit" href={`https://www.youtube.com/watch?v=${heroVideoId}`} target="_blank" rel="noreferrer">
              Fondo: “Blanco Perfecto” · upload rotulado videoclip oficial; canal por verificar <ExternalLink size={12} />
            </a>
          </div>
          <div className="hero-bottom"><span>ARCHIVO MUSICAL INDEPENDIENTE</span><span className="hero-rule" /><a href="#discografia">DESLIZAR <ArrowDown size={14} /></a></div>
          <span className="hero-index">UY / 01—26</span>
        </section>

        {playlistOpen && (
          <div className="playlist-backdrop" role="presentation" onClick={() => setPlaylistOpen(false)}>
            <section ref={dialogRef} className="playlist-dialog" role="dialog" aria-modal="true" aria-labelledby="playlist-title" tabIndex={-1} onClick={(event) => event.stopPropagation()}>
              <div className="playlist-header">
                <div><p className="eyebrow"><Disc3 size={14} /> RECORRIDO DE ESCUCHA · ORDEN CRONOLÓGICO</p><h2 id="playlist-title">Toda la discografía.<br /><span>Un bloque a la vez.</span></h2></div>
                <button className="playlist-close" type="button" onClick={() => setPlaylistOpen(false)} aria-label="Cerrar reproductor"><X size={20} /></button>
              </div>
              <div className="playlist-layout">
                <div className="playlist-queue">
                  <div className="playlist-total"><strong>{queueTotal}</strong><span>cortes · 5 bloques<br />2005 → 2026</span></div>
                  <ol className="playlist-albums">
                    {discographyQueue.map((album, index) => (
                      <li key={album.id}>
                        <button className={index === selectedAlbumIndex ? "playlist-album active" : "playlist-album"} type="button" onClick={() => chooseAlbum(index)} aria-current={index === selectedAlbumIndex ? "step" : undefined}>
                          <span className="playlist-number">{String(index + 1).padStart(2, "0")}</span><span className="playlist-album-title"><strong>{album.title}</strong><small>{album.year} · {album.trackCount} temas · {album.playback.provider}</small></span><Play size={15} aria-hidden="true" />
                        </button>
                        <details className="playlist-track-details" open={index === selectedAlbumIndex}>
                          <summary>Elegir canción <span>{album.trackCount} pistas</span></summary>
                          <ol>{album.tracks.map((track, trackIndex) => <li className={index === selectedAlbumIndex && trackIndex === selectedTrackIndex ? "is-current" : undefined} key={`${album.id}-queue-${trackIndex}`}><span>{String(trackIndex + 1).padStart(2, "0")}</span><span><button className="playlist-track-select" type="button" onClick={() => index === selectedAlbumIndex ? chooseTrack(trackIndex) : openTrack(index, trackIndex)} aria-pressed={index === selectedAlbumIndex && trackIndex === selectedTrackIndex}><span>{track.title}</span><Play size={12} aria-hidden="true" /></button>{track.note && <small>{track.note}</small>}</span></li>)}</ol>
                        </details>
                      </li>
                    ))}
                  </ol>
                  <p className="playlist-hint">Elegí cualquier tema sin salir de la página. YouTube continúa dentro de sus listas y SoundCloud conserva su reproductor visual para <em>Insoportable</em>; al terminar el último corte, la cola intenta pasar al bloque siguiente.</p>
                </div>
                <div className="playlist-player">
                  <div className="playlist-now"><span>EN LA COLA · {String(selectedAlbumIndex + 1).padStart(2, "0")} / {String(discographyQueue.length).padStart(2, "0")}</span><a href={selectedAlbum.playback.sourceUrl} target="_blank" rel="noreferrer">ABRIR EN {selectedAlbum.playback.provider} <ExternalLink size={12} /></a></div>
                  <h3>{selectedAlbum.tracks[selectedTrackIndex]?.title ?? selectedAlbum.title}</h3>
                  <p className="playlist-subtitle">{selectedAlbum.title} · {selectedAlbum.yearLabel} · tema {String(selectedTrackIndex + 1).padStart(2, "0")} de {selectedAlbum.trackCount}</p>
                  <PlaybackQueuePlayer key={selectedAlbum.id} album={selectedAlbum} selectedTrackIndex={selectedTrackIndex} selectionRequestId={selectionRequestId} onTrackChange={(index) => setSelectedTrackIndex((current) => current === index ? current : index)} onEnded={advanceBlock} />
                  <p className="playlist-attribution">{selectedAlbum.playback.note}</p>
                  <div className="playlist-controls">
                    <button type="button" onClick={() => chooseAlbum(selectedAlbumIndex - 1)} disabled={selectedAlbumIndex === 0}>Anterior</button>
                    <button className="next-album" type="button" onClick={advanceBlock} disabled={selectedAlbumIndex === discographyQueue.length - 1}>Siguiente bloque <ArrowUpRight size={14} /></button>
                  </div>
                  <p className="player-note">Las pistas de YouTube son audios de catálogo completos; SoundCloud cubre el set de <em>Insoportable</em>. Las cuentas Topic no se presentan como administradas por la banda. Si una pista no está disponible en tu región, abrí la lista de origen desde arriba.</p>
                </div>
              </div>
            </section>
          </div>
        )}

        <section className="intro section-pad">
          <div className="section-label"><span>01</span> / SOBRE EL ARCHIVO</div>
          <div className="intro-grid">
            <h2>Una historia.<br /><span>Muchas huellas.</span></h2>
            <div className="intro-copy">
              <p>Doberman nació en Montevideo a comienzos de los 2000. Sus discos, canciones y registros quedaron repartidos entre plataformas, notas de prensa, catálogos y subidas de video.</p>
              <p>Este archivo los reúne sin hablar en nombre de la banda. La procedencia se muestra al lado de cada dato; cuando una fecha, atribución o grafía no cierra, también queda anotado.</p>
            </div>
          </div>
          <div className="stat-line">
            <div><strong>04</strong><span>álbumes de estudio</span></div>
            <div><strong>{String(trackTotal).padStart(2, "0")}</strong><span>temas en los cuatro discos</span></div>
            <div><strong>2001—26</strong><span>huellas cronológicas</span></div>
            <p>Archivo independiente · última revisión de fuentes: noviembre de 2026</p>
          </div>
        </section>

        <section className="band-profile section-pad" id="banda">
          <div className="section-label"><span>01b</span> / PERFIL DE LA BANDA</div>
          <dl className="band-profile-list">
            {bandProfile.map((item) => (
              <div className="band-profile-item" key={item.label}>
                <dt>{item.label}</dt>
                <dd>
                  <p>{item.text}</p>
                  <a href={item.source.url} target="_blank" rel="noreferrer">Fuente: {item.source.label}<ArrowUpRight size={13} /></a>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <ArchiveChat />

        <section className="discography section-pad" id="discografia">
          <div className="section-heading">
            <div><div className="section-label"><span>02</span> / DISCOGRAFÍA</div><h2>Cuatro discos.<br /><span>Cuatro momentos.</span></h2></div>
            <p>Los álbumes de estudio en orden de edición. Buscá por disco o por canción; cada ficha conserva su época, su lista de temas y los enlaces disponibles.</p>
          </div>
          <label className="search-box album-search"><Search size={17} aria-hidden="true" /><span className="sr-only">Buscar en la discografía</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar álbum, tema o año…" /><span className="search-count">{filteredAlbums.length} / {albums.length} discos</span>{query && <button type="button" onClick={() => setQuery("")} aria-label="Limpiar búsqueda"><X size={15} /></button>}</label>
          <div className="album-list">
            {filteredAlbums.map((album, index) => (
              <article className="album-card" key={album.id}>
                <div className="album-art-wrap">
                  {album.cover ? <img className="album-art" src={album.cover} alt={`Arte de portada de ${album.title}, ${album.year}`} loading="lazy" /> : <div className="album-art album-art-type" aria-label={`Ficha tipográfica de ${album.title}`}><span>DOBERMAN</span><strong>{album.title}</strong><small>{album.year} / UY</small></div>}
                  {album.coverCredit && <a className="art-credit" href={album.coverCredit.url} target="_blank" rel="noreferrer">ARTE / FUENTE <ExternalLink size={11} /></a>}
                </div>
                <div className="album-info">
                  <div className="album-overline"><span>0{index + 1}</span><span>{album.yearLabel}</span></div>
                  <h3>{album.title}</h3>
                  <div className="album-meta"><span><CalendarDays size={13} /> {album.year}</span><span><Music2 size={13} /> {album.trackCount} temas</span><span>{album.era}</span></div>
                  <p className="album-note">{album.note}</p>
                  <p className="evidence-note">{album.confidence}</p>
                  {album.lineup && <p className="album-detail"><strong>Formación:</strong> {album.lineup}</p>}
                  {album.credits?.map((credit) => <p className="album-detail" key={credit}><strong>Créditos:</strong> {credit}</p>)}
                  <details className="track-details" open={Boolean(query)}>
                    <summary><span>Lista de temas</span><span>{album.trackCount} pistas <span className="summary-plus">+</span></span></summary>
                    <ol className="track-list">
                      {album.tracks.map((track, trackIndex) => (
                        <li key={`${album.id}-${trackIndex}`}>
                          <span className="track-number">{String(trackIndex + 1).padStart(2, "0")}</span>
                          <button className="track-select" type="button" onClick={() => openTrack(discographyQueue.findIndex((queuedAlbum) => queuedAlbum.id === album.id), trackIndex)} aria-label={`Reproducir ${track.title} de ${album.title} dentro de la página`}><span>{track.title}</span><Play size={12} aria-hidden="true" /></button>
                          {track.note && <small>{track.note}</small>}
                        </li>
                      ))}
                    </ol>
                  </details>
                  <ExternalLinks links={album.links} className="album-sources" />
                </div>
              </article>
            ))}
            {filteredAlbums.length === 0 && <p className="empty-state">No aparece ese término en la discografía. Probá con el nombre de una canción.</p>}
          </div>

          <article className="compilation-card">
            <div className="compilation-stamp">XX<br /><span>2026</span></div>
            <div className="compilation-copy"><div className="section-label"><span>COMPILADO · NO ES UN QUINTO ÁLBUM</span></div><h3>{compilationXX.title}</h3><p>{compilationXX.note}</p><ExternalLinks links={compilationXX.links} className="source-links" /></div>
            <details className="compilation-tracks"><summary>Elegir entre las 15 pistas <span>+</span></summary><ol>{compilationXX.tracks.map((track, index) => <li key={`${track}-${index}`}><span>{String(index + 1).padStart(2, "0")}</span><button className="track-select" type="button" onClick={() => openTrack(discographyQueue.length - 1, index)} aria-label={`Reproducir ${track} del compilado XX dentro de la página`}><span>{track}</span><Play size={12} aria-hidden="true" /></button></li>)}</ol></details>
          </article>
          <p className="editorial-note"><strong>Nota de lectura.</strong> El cuarto disco, <em>Insoportable</em>, fue editado a fines de 2014 y presentado en 2015 con una formación posterior a la salida de Nacho Obes. La entrevista de Obes en 2026 menciona un trabajo sin edición física, pero no lo nombra; su identificación con <em>Insoportable</em> es probable por fecha y formato, no una cita textual.</p>
        </section>

        <section className="media-archive section-pad" id="archivo">
          <div className="section-heading">
            <div><div className="section-label"><span>03</span> / ARCHIVO AUDIOVISUAL</div><h2>Imagen, sonido<br /><span>y procedencia.</span></h2></div>
            <p>Una selección inicial de videoclips, sesiones y registros. Los videos siguen en sus plataformas originales; ninguna subida se convierte en “oficial” por estar enlazada aquí.</p>
          </div>
          <div className="filter-row" role="group" aria-label="Filtrar audiovisuales">
            {mediaFilters.map((filter) => <button key={filter} className={mediaFilter === filter ? "filter-chip active" : "filter-chip"} type="button" onClick={() => setMediaFilter(filter)}>{filter}</button>)}
            <span className="filter-result">{filteredMedia.length} registros</span>
          </div>
          <div className="media-grid">
            {filteredMedia.map((item, index) => (
                <article className="media-card" key={item.url}>
                  <a className="media-thumb" href={item.url} target="_blank" rel="noreferrer" aria-label={`Abrir ${item.title} en su fuente`}>
                  {item.url.includes("youtube.com/watch?v=") ? <img src={`https://i.ytimg.com/vi/${item.url.split("v=")[1]?.split("&")[0] ?? heroVideoId}/hqdefault.jpg`} alt="" loading="lazy" onError={(event) => { event.currentTarget.src = "/archive/tren-calavera-2011.jpg"; }} /> : <div className="media-art-placeholder" aria-hidden="true"><span>D/</span><small>{item.year}</small></div>}
                  <span className="media-play"><Play size={16} fill="currentColor" /></span><span className="media-number">0{index + 1}</span>
                </a>
                <div className="media-card-body"><div className="media-meta"><span>{item.category}</span><span>{item.year}</span></div><h3>{item.title}</h3><p>{item.description}</p><div className="media-credit"><span>{item.confidence}</span><a href={item.url} target="_blank" rel="noreferrer">{item.sourceLabel}<ArrowUpRight size={13} /></a></div></div>
              </article>
            ))}
          </div>
          {filteredMedia.length === 0 && <p className="empty-state">No encontramos material con esos filtros.</p>}
        </section>

        <section className="timeline-section section-pad" id="cronologia">
          <div className="section-heading timeline-intro"><div><div className="section-label"><span>04</span> / CRONOLOGÍA</div><h2>Una banda,<br /><span>distintas etapas.</span></h2></div><p>Fechas y transiciones atribuidas a fuentes identificables. Un plan anunciado no se presenta como un concierto realizado; un recuerdo retrospectivo se identifica como tal.</p></div>
          <div className="timeline-list">
            {timeline.map((item, index) => <article className="timeline-item" key={`${item.year}-${item.title}`}><div className="timeline-marker"><span>0{index + 1}</span><i /></div><div className="timeline-entry"><time>{item.year}</time><h3>{item.title}</h3><p>{item.text}</p><a href={item.source.url} target="_blank" rel="noreferrer">Fuente: {item.source.label}<ArrowUpRight size={13} /></a></div></article>)}
          </div>
        </section>

        <section className="press-section section-pad" id="prensa">
          <div className="section-heading"><div><div className="section-label"><span>05</span> / ENTREVISTAS Y PRENSA</div><h2>La banda<br /><span>en sus palabras.</span></h2></div><p>Entrevistas, anuncios de discos y notas de regreso. Se enlaza cada pieza al medio que la publicó y se conserva la fecha original.</p></div>
          <div className="press-list">{pressItems.map((item, index) => <article className="press-item" key={item.url}><span className="press-index">0{index + 1}</span><div className="press-main"><div className="press-meta"><span>{item.outlet}</span><time>{item.date}</time></div><h3>{item.title}</h3><p>{item.text}</p></div><a className="press-open" href={item.url} target="_blank" rel="noreferrer" aria-label={`Leer ${item.title} en ${item.outlet}`}><ArrowUpRight size={20} /></a></article>)}</div>
        </section>

        <section className="sources-section section-pad" id="fuentes">
          <div className="sources-heading"><div><div className="section-label"><span>06</span> / PROCEDENCIA</div><h2>Un archivo abierto.<br /><span>Una fuente a la vista.</span></h2></div><p>Este proyecto no es un sitio oficial ni representa a Doberman, Nacho Obes o sus integrantes. Ordena referencias y enlaza al origen. Las portadas se muestran como referencia de catálogo; los audiovisuales se reproducen desde su plataforma de origen.</p></div>
          <div className="source-groups">{sourceDirectory.map((group) => <div className="source-group" key={group.group}><h3>{group.group}</h3><ExternalLinks links={group.items} className="source-grid" /></div>)}</div>
          <div className="source-legend"><span><i className="legend-solid" /> Hecho documentado / fuente identificable</span><span><i className="legend-outline" /> Atribución o fecha pendiente</span><span><FileText size={14} /> Las notas editoriales no sustituyen a los originales</span></div>
          <div className="profile-strip"><span>FUENTES DE CATÁLOGO</span><a href={sources.instagram.url} target="_blank" rel="noreferrer">Instagram · @doberman.uy <ExternalLink size={13} /></a><a href={sources.soundcloudProfile.url} target="_blank" rel="noreferrer">SoundCloud · catálogo histórico <ExternalLink size={13} /></a><a href={sources.youtubeDebut.url} target="_blank" rel="noreferrer">YouTube · lista de álbum <ExternalLink size={13} /></a></div>
        </section>
      </main>

      <footer className="footer"><a className="footer-brand" href="#inicio">D/ <strong>DOBERMAN</strong></a><span>ARCHIVO INDEPENDIENTE · MONTEVIDEO, URUGUAY</span><a href="#inicio">VOLVER ARRIBA ↑</a></footer>
    </div>
  );
}
