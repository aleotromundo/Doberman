import { albums, compilationXX, type Album, type Track } from "@/data/doberman";

export type PlaybackSource = {
  provider: "YouTube" | "SoundCloud";
  mode: "playlist" | "set";
  sourceUrl: string;
  playlistId?: string;
  videoIds?: string[];
  trackUrls?: string[];
  note: string;
};

export type QueueTrack = Track & { sourceUrl: string };
type PlaylistAlbum = Omit<Pick<Album, "id" | "title" | "year" | "yearLabel" | "era" | "trackCount" | "note">, "trackCount"> & {
  trackCount: number;
  tracks: QueueTrack[];
  playback: PlaybackSource;
};

const playbackByAlbum: Record<string, PlaybackSource> = {
  "doberman-2005": {
    provider: "YouTube",
    mode: "playlist",
    playlistId: "OLAK5uy_kr9cbBok5cEMFDAkUNZLX4cyqWMo9j6Hg",
    sourceUrl: "https://www.youtube.com/playlist?list=OLAK5uy_kr9cbBok5cEMFDAkUNZLX4cyqWMo9j6Hg",
    videoIds: ["zeTK980ivNA", "Z3jc5rq0jB4", "mFQ5XWcLJns", "QG8koWZVKEk", "T9lzfna3i1c", "xcfLX4d6ssg", "Ohnx5zmK9EQ", "dwxyeZ-F-mU", "Xypgsb0O5Eo", "2l0iWUCGSGM", "f0kxmtbynns", "aiY6xAOfPwU"],
    note: "Lista de álbum auto-generada en YouTube Music / DOBERMAN - Topic. Incluye 12 pistas de duración completa según el catálogo. La identidad Topic y la entrega de Tritono no prueban que el canal sea administrado directamente por la banda.",
  },
  "el-ultimo-en-pie-2007": {
    provider: "YouTube",
    mode: "playlist",
    playlistId: "OLAK5uy_niHZpbtYf8KBdGRKF3i0nZ0wIy_N0FmdQ",
    sourceUrl: "https://www.youtube.com/playlist?list=OLAK5uy_niHZpbtYf8KBdGRKF3i0nZ0wIy_N0FmdQ",
    videoIds: ["u9b_AEog6hU", "k1DDL74SI-c", "K_cS4O8krCc", "oKQbm0v8lh4", "j9UxS9daqjk", "s6XXE44hzZA", "krH4Dh1Wgo4", "Sb3hh1gdwGs", "_5v1FKivYNw", "Ri2EGGTBJSo", "_xIUnHC3RJs", "oz84Fqrxdfk"],
    note: "Playlist de 12 audios de catálogo atribuidos a DOBERMAN - Topic y Tritono. Son remasterizaciones distribuidas en 2026, no una captura de la edición original de 2007; la pista 10 aparece como “Si Pudiera” en la plataforma.",
  },
  "tren-calavera-2011": {
    provider: "YouTube",
    mode: "playlist",
    playlistId: "OLAK5uy_ncHm-bh6bd08a-QiNRDFFB5244Bug1Uhw",
    sourceUrl: "https://www.youtube.com/playlist?list=OLAK5uy_ncHm-bh6bd08a-QiNRDFFB5244Bug1Uhw",
    videoIds: ["FZn6uNFWpGU", "YlflPYv3_lw", "ddg1KCBTFYc", "8xms3Z0UV-4", "8SmMikxrZPk", "2PpEf0ySLXY", "KmuGo9uyldM", "negix85eJ7w", "AvoGzv8E15I", "yWRW0j41sRw"],
    note: "Playlist alternativa de diez pistas seleccionables. Reemplaza la subida continua de álbum reportada como “video no disponible”; las páginas de audio de DOBERMAN - Topic muestran entrega de Tritono. El último tema figura como “Una Sola Voz”.",
  },
  "insoportable-2014": {
    provider: "SoundCloud",
    mode: "set",
    sourceUrl: "https://soundcloud.com/dobermanrocks/sets/insoportable",
    trackUrls: [
      "https://soundcloud.com/dobermanrocks/ni-una-palabra",
      "https://soundcloud.com/dobermanrocks/molde",
      "https://soundcloud.com/dobermanrocks/contramano",
      "https://soundcloud.com/dobermanrocks/igual-que-ayer",
      "https://soundcloud.com/dobermanrocks/interferencia",
      "https://soundcloud.com/dobermanrocks/insoportable",
      "https://soundcloud.com/dobermanrocks/deja-vu",
      "https://soundcloud.com/dobermanrocks/santos-inocentes",
      "https://soundcloud.com/dobermanrocks/nada-de-mi",
      "https://soundcloud.com/dobermanrocks/tiburon",
      "https://soundcloud.com/dobermanrocks/zombie-en-mi-placard",
      "https://soundcloud.com/dobermanrocks/no-va-mas",
    ],
    note: "Set de SoundCloud con 12 pistas y selector visual. Se conserva el espectro y el reproductor incrustado. El perfil se asocia a Montevideo, pero su titularidad oficial no se pudo confirmar independientemente.",
  },
};

function attachSources(tracks: Track[], playback: PlaybackSource): QueueTrack[] {
  return tracks.map((track, index) => ({
    ...track,
    sourceUrl: playback.provider === "SoundCloud"
      ? playback.trackUrls?.[index] ?? playback.sourceUrl
      : `https://www.youtube.com/watch?v=${playback.videoIds?.[index] ?? ""}`,
  }));
}

const studioAlbums: PlaylistAlbum[] = albums.map((album) => {
  const playback = playbackByAlbum[album.id];
  return { ...album, playback, tracks: attachSources(album.tracks, playback) };
});

const xxPlayback: PlaybackSource = {
  provider: "YouTube",
  mode: "playlist",
  playlistId: "OLAK5uy_k8L20q25r2rovED60JcB4Ek6eccwOW868",
  sourceUrl: "https://www.youtube.com/playlist?list=OLAK5uy_k8L20q25r2rovED60JcB4Ek6eccwOW868",
  videoIds: ["Fsjy5w715dY", "KPSukzthUSQ", "7XpBXTHANek", "zKr-5pNrlF0", "Z9EV48QtqEc", "a91VE9Bwin4", "yDEDtKaGCIw", "DIcsu_3nkH8", "bBYrrG6XgBg", "xKqXBzM_3sU", "FZ6cHIm0hHg", "hFnGw8YBfMM", "ryKVYJowTjI", "mtR3Be9LZPo", "Y21Rl4qSRU8"],
  note: "Playlist retrospectiva de 15 audios del canal Topic / Tritono, con selector de pista. No es un álbum de estudio.",
};

const xxCompilation: PlaylistAlbum = {
  id: "xx-compilation-2026",
  title: compilationXX.title,
  year: compilationXX.year,
  yearLabel: "Compilado retrospectivo · no es un quinto álbum de estudio",
  era: "Remasterizaciones y bonus",
  note: compilationXX.note,
  trackCount: compilationXX.tracks.length,
  tracks: attachSources(compilationXX.tracks.map((title): Track => ({ title })), xxPlayback),
  playback: xxPlayback,
};

export type QueueAlbum = (typeof studioAlbums)[number] | typeof xxCompilation;
export const discographyQueue: QueueAlbum[] = [...studioAlbums, xxCompilation];
