import { albums, compilationXX, type Album, type Track } from "@/data/doberman";

export type PlaybackSource = {
  provider: "YouTube" | "Spotify" | "SoundCloud";
  embedUrl: string;
  sourceUrl: string;
  note: string;
};

type PlaylistAlbum = Pick<Album, "id" | "title" | "year" | "yearLabel" | "era" | "trackCount" | "note" | "tracks"> & { playback: PlaybackSource };

const playbackByAlbum: Record<string, PlaybackSource> = {
  "doberman-2005": {
    provider: "YouTube",
    embedUrl: "https://www.youtube-nocookie.com/embed/MOpEuTg4NAg?autoplay=1&playsinline=1&rel=0&modestbranding=1",
    sourceUrl: "https://www.youtube.com/watch?v=MOpEuTg4NAg",
    note: "Álbum completo subido por un canal de terceros; el uploader y la autorización no están autenticados. Se enlaza la fuente original.",
  },
  "el-ultimo-en-pie-2007": {
    provider: "Spotify",
    embedUrl: "https://open.spotify.com/embed/album/48rqN1aSeDOMWPX5kQCNQK?utm_source=generator&theme=0",
    sourceUrl: "https://open.spotify.com/album/48rqN1aSeDOMWPX5kQCNQK",
    note: "Edición digital remasterizada que aparece en el perfil atribuido a Doberman. Spotify puede pedir sesión o Play. La cola espera señales de inicio de sus pistas y estima el fin en la última; el embed no garantiza un evento de fin de álbum y “Siguiente bloque” queda de respaldo.",
  },
  "tren-calavera-2011": {
    provider: "YouTube",
    embedUrl: "https://www.youtube-nocookie.com/embed/IbHvpIdGwS8?autoplay=1&playsinline=1&rel=0&modestbranding=1",
    sourceUrl: "https://www.youtube.com/watch?v=IbHvpIdGwS8",
    note: "Video de álbum completo útil para cotejo; uploader y autorización no confirmados. El audio permanece alojado en YouTube.",
  },
  "insoportable-2014": {
    provider: "SoundCloud",
    embedUrl: "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/dobermanrocks/sets/insoportable&color=%23d94a3b&auto_play=true&hide_related=true&show_comments=false&show_user=true&show_reposts=false&visual=true",
    sourceUrl: "https://soundcloud.com/dobermanrocks/sets/insoportable",
    note: "Set de doce pistas publicado en el perfil que se identifica con Doberman, Montevideo. El pase automático espera al último tema del set y conserva los controles originales de SoundCloud.",
  },
};

const studioAlbums: PlaylistAlbum[] = albums.map((album) => ({
  ...album,
  playback: playbackByAlbum[album.id],
}));

const xxCompilation: PlaylistAlbum = {
  id: "xx-compilation-2026",
  title: compilationXX.title,
  year: compilationXX.year,
  yearLabel: "Compilado retrospectivo · no es un quinto álbum de estudio",
  era: "Remasterizaciones y bonus",
  trackCount: compilationXX.tracks.length,
  note: compilationXX.note,
  tracks: compilationXX.tracks.map((title): Track => ({ title })),
  playback: {
    provider: "Spotify",
    embedUrl: "https://open.spotify.com/embed/album/7pz8EkVWNvugAYSrCdUKlG?utm_source=generator&theme=0",
    sourceUrl: "https://open.spotify.com/album/7pz8EkVWNvugAYSrCdUKlG",
    note: "Compilado retrospectivo con títulos repetidos de los álbumes históricos y dos bonus. No se cuenta como álbum de estudio. Spotify puede pedir sesión; la cola estima el fin tras detectar el inicio de todas sus pistas y conserva “Siguiente bloque” de respaldo.",
  },
};

export const discographyQueue: PlaylistAlbum[] = [...studioAlbums, xxCompilation];
