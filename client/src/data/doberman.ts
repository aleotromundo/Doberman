export type SourceLink = { label: string; url: string; type?: "Banda / perfil" | "Prensa" | "Catálogo" | "Plataforma" | "Video" };
export type Track = { title: string; url?: string; note?: string };
export type Album = {
  id: string;
  title: string;
  year: string;
  yearLabel: string;
  era: string;
  trackCount: number;
  note: string;
  confidence: string;
  cover?: string;
  coverCredit?: SourceLink;
  lineup?: string;
  credits?: string[];
  links: SourceLink[];
  tracks: Track[];
};

export const sources = {
  obesInterview: { label: "SÓLO ROCK Uruguay · entrevista a Nacho Obes", url: "https://solorock-uruguay.com/2026/04/20/nacho-obes-rockero-profesional/", type: "Prensa" as const },
  discogsArtist: { label: "Discogs · perfil de Doberman (Uruguay)", url: "https://www.discogs.com/artist/4631518-Doberman-9", type: "Catálogo" as const },
  discogsDebut: { label: "Discogs · edición CD de Doberman (2005)", url: "https://www.discogs.com/release/11137878-Doberman-Doberman", type: "Catálogo" as const },
  discogsUltimo: { label: "Discogs · edición CD de El Último En Pie (2007)", url: "https://www.discogs.com/release/11416414-Doberman-El-%C3%9Altimo-En-Pie", type: "Catálogo" as const },
  discogsTren: { label: "Discogs · edición CD de Tren Calavera (2011)", url: "https://www.discogs.com/release/14554835-Doberman-Tren-Calavera", type: "Catálogo" as const },
  soundcloudSet: { label: "SoundCloud · INSOPORTABLE (12 pistas)", url: "https://soundcloud.com/dobermanrocks/sets/insoportable", type: "Plataforma" as const },
  soundcloudProfile: { label: "SoundCloud · perfil Doberman rocks", url: "https://soundcloud.com/dobermanrocks", type: "Banda / perfil" as const },
  youtubeDebut: { label: "YouTube Music · Doberman (2005), 12 pistas", url: "https://www.youtube.com/playlist?list=OLAK5uy_kr9cbBok5cEMFDAkUNZLX4cyqWMo9j6Hg", type: "Plataforma" as const },
  youtubeUltimo: { label: "YouTube · El Último En Pie (remaster 2026), 12 pistas", url: "https://www.youtube.com/playlist?list=OLAK5uy_niHZpbtYf8KBdGRKF3i0nZ0wIy_N0FmdQ", type: "Plataforma" as const },
  youtubeTren: { label: "YouTube · Tren Calavera (DOBERMAN - Topic), 10 pistas", url: "https://www.youtube.com/playlist?list=OLAK5uy_ncHm-bh6bd08a-QiNRDFFB5244Bug1Uhw", type: "Plataforma" as const },
  youtubeXX: { label: "YouTube · XX (DOBERMAN - Topic), 15 pistas", url: "https://www.youtube.com/playlist?list=OLAK5uy_k8L20q25r2rovED60JcB4Ek6eccwOW868", type: "Plataforma" as const },
  montevideoInsoportable: { label: "Montevideo Portal · presentación de Insoportable", url: "https://www.montevideo.com.uy/Archivo/Doberman-presenta-disco-y-responde-la-metralleta-uc269531", type: "Prensa" as const },
  diaria2015: { label: "la diaria · Matías Kramer y la presentación de 2015", url: "https://ladiaria.com.uy/articulo/2015/5/el-hombre-de-atras/", type: "Prensa" as const },
  metronomo2026: { label: "Metrónomo · catálogo y reediciones (2026)", url: "https://metronomo.uy/2026/04/27/lanzamientos-doberman-rodra-ft-flor-sakeo-carlos-casacuberta-ft-martin-rivero-paul-higgs-y-el-color-ausente/", type: "Prensa" as const },
  cooltivarteTren: { label: "Cooltivarte · relanzamiento de Tren Calavera", url: "https://cooltivarte.com/portal/doberman-relanza-tren-calavera/", type: "Prensa" as const },
  instagram: { label: "Instagram · @doberman.uy / DOBERMANXX", url: "https://www.instagram.com/doberman.uy/", type: "Banda / perfil" as const },
  elPais2005: { label: "El País · presentación del primer disco (2005)", url: "https://www.elpais.com.uy/tvshow/doberman-presenta-hoy-su-primer-disco", type: "Prensa" as const },
  laDiariaComeback: { label: "la diaria · regreso de Doberman (2026)", url: "https://ladiaria.com.uy/cultura/articulo/2026/6/yo-soy-el-fan-numero-uno-de-mi-banda-nacho-obes-y-el-regreso-de-doberman/", type: "Prensa" as const },
  elPaisComeback: { label: "El País · entrevista a Nacho Obes sobre el regreso (2026)", url: "https://www.elpais.com.uy/sabado-show/nacho-obes-el-regreso-con-doberman-su-carrera-de-showman-y-por-que-no-salio-el-jingle-para-alvaro-delgado", type: "Prensa" as const },
  soundclick: { label: "SoundClick · archivo y relato del primer disco", url: "https://www.soundclick.com/dobermanuru", type: "Banda / perfil" as const },
  cdRelease2005: { label: "Discogs · imagen/registro del CD de 2005", url: "https://www.discogs.com/release/11137878-Doberman-Doberman", type: "Catálogo" as const },
  cdRelease2007: { label: "Discogs · imagen/registro del CD de 2007", url: "https://www.discogs.com/release/11416414-Doberman-El-%C3%9Altimo-En-Pie", type: "Catálogo" as const },
  sietenotasProfile: { label: "SieteNotas · perfil de Doberman (sin fecha)", url: "https://sietenotas.com/Interpretes/interprete.aspx?i=3A381547-D2D9-4E2D-8BC7-4FDC31456542", type: "Banda / perfil" as const },
  graffiti2006: { label: "Premios Graffiti · ganadores 2006", url: "https://www.premiosgraffiti.com.uy/ganadores/ganadores-2006/", type: "Prensa" as const },
  graffiti2012: { label: "Premios Graffiti · ganadores 2012", url: "https://www.premiosgraffiti.com.uy/ganadores/ganadores-2012/", type: "Prensa" as const },
  metronomoTren2026: { label: "Metrónomo · reedición de Tren Calavera (mayo 2026)", url: "https://metronomo.uy/2026/05/19/lanzamientos-carlos-casacuberta-la-chancha-charlie-cromo-doberman-cossi-y-mancuso-las-malas-lenguas/", type: "Prensa" as const },
  montevideo2020Obes: { label: "Montevideo Portal · entrevista a Nacho Obes (22 may 2020)", url: "https://www.montevideo.com.uy/Tiempo-libre/Nacho-Obes-esta-en-el-centro-de-una-tormenta-mediatica-que-el-mismo-se-propuso-dominar-uc753470", type: "Prensa" as const },
} satisfies Record<string, SourceLink>;

export const albums: Album[] = [
  {
    id: "doberman-2005",
    title: "Doberman",
    year: "2005",
    yearLabel: "Disco debut · independiente",
    era: "Primera formación",
    trackCount: 12,
    note: "El debut homónimo fue editado de forma independiente. El registro del CD lista doce cortes; la portada mostrada se atribuye a la ficha colaborativa de Discogs.",
    confidence: "Título y año confirmados · orden según ficha CD",
    cover: "/archive/doberman-2005.jpeg",
    coverCredit: sources.cdRelease2005,
    lineup: "Formación de época según Nacho Obes: Obes, Andrés Mozzo, Germán Seoane y Matías Kramer. El perfil no fechado de SieteNotas lista los mismos cuatro nombres.",
    credits: [
      "Nota de producción en la ficha de Discogs: Federico Langwagen y Doberman.",
      "Premio Graffiti 2006 a Revelación del año, listado como “Doberman – Doberman”.",
    ],
    links: [sources.discogsDebut, sources.elPais2005, sources.soundclick, sources.youtubeDebut],
    tracks: [
      { title: "Actitud" }, { title: "Entre Ceja y Ceja" }, { title: "Hermosa Judas" }, { title: "La Piel Del Lobo", note: "Demo de 2002 según Obes. El perfil no fechado de SieteNotas indica que fue regrabada en Sondor con el técnico Daniel Baéz (Octopus)." },
      { title: "Cruz Del Sur" }, { title: "Yoyogui Sam" }, { title: "Intro (Wallace)" }, { title: "Wallace" },
      { title: "Ave Cesar" }, { title: "Un Vaso En Alto" }, { title: "Nueve Vidas" }, { title: "Sangre De Perdedor" },
    ],
  },
  {
    id: "el-ultimo-en-pie-2007",
    title: "El Último En Pie",
    year: "2007",
    yearLabel: "Segundo álbum · independiente",
    era: "Primera formación",
    trackCount: 12,
    note: "Nacho Obes lo identifica como el segundo álbum de la banda. “Perro Fiel” fue señalado por prensa e integrantes como adelanto/corte de difusión.",
    confidence: "Título, año y orden según ficha de edición CD",
    cover: "/archive/el-ultimo-en-pie-2007.jpeg",
    coverCredit: sources.cdRelease2007,
    credits: ["Según una nota del perfil de SieteNotas (sin fecha), la presentación del disco estuvo a cargo de Germán Seoane."],
    links: [sources.discogsUltimo, sources.obesInterview, sources.metronomo2026, sources.youtubeUltimo],
    tracks: [
      { title: "Ángel Caído" }, { title: "Perro Fiel" }, { title: "Jaque Al Rey" }, { title: "Dios Del Rock" },
      { title: "Solo" }, { title: "El Último En Pie" }, { title: "Para Recordar" }, { title: "Eterno Boulevard" },
      { title: "Veneno" }, { title: "Si Pudieras" }, { title: "Muerte Súbita" }, { title: "Bonanza" },
    ],
  },
  {
    id: "tren-calavera-2011",
    title: "Tren Calavera",
    year: "2011",
    yearLabel: "Grabado en 2010 · editado en 2011",
    era: "Primera formación · cambios de bajo",
    trackCount: 10,
    note: "Tercer álbum de la etapa de Obes. En la edición digital aparecen variantes entre “Toby Tomas” / “Tomy Tobas” y “Solo Una Voz” / “Una Sola Voz”; se conservan señaladas.",
    confidence: "Diez temas contrastados · variantes de grafía en fuentes",
    cover: "/archive/tren-calavera-2011.jpg",
    coverCredit: sources.discogsTren,
    lineup: "Nacho Obes como frontman. Sobre el bajo hay fuentes en conflicto: Metrónomo (2026) atribuye la incorporación de Federico Delfino al bajo en esta etapa; el perfil no fechado de SieteNotas lo atribuye a Obes.",
    credits: [
      "Grabado en Estudios InZen, con técnico Javier Longhi y drum doctor Irvin Carballo. Dato informado por la reedición digital de 2026 (Cooltivarte), no comprobado con el libreto de 2011.",
      "Premio Graffiti 2012 a Mejor Álbum de Metal y Hard Rock, listado como “Tren calavera” de Doberman.",
    ],
    links: [sources.discogsTren, sources.youtubeTren, sources.cooltivarteTren],
    tracks: [
      { title: "Tren Calavera" }, { title: "Animal" }, { title: "Blanco Perfecto", note: "El videoclip existe como pieza audiovisual aparte del audio de álbum." },
      { title: "Morir Así" }, { title: "Despegar" }, { title: "La Cacería" },
      { title: "Toby Tomas", note: "El video de disco completo transcribe “Tomy Tobas”; la ficha del CD y la distribución digital presentan “Toby Tomas”." },
      { title: "Como Una Piedra" }, { title: "Contragolpe" }, { title: "Solo Una Voz", note: "La ficha digital 2026 lista “Una Sola Voz”." },
    ],
  },
  {
    id: "insoportable-2014",
    title: "Insoportable",
    year: "2014",
    yearLabel: "Editado a fines de 2014 · presentado en 2015",
    era: "Etapa posterior a Nacho Obes",
    trackCount: 12,
    note: "Cuarto álbum documentado. La prensa de 2015 lo presenta como el disco de la formación con Alejandro Llambías y Fernando López; su difusión fue digital y gratuita. La mención de Obes a un álbum posterior sin edición física probablemente corresponde a este trabajo, aunque no lo nombra explícitamente.",
    confidence: "Año, estatus y 12 pistas respaldados por prensa y perfil de la banda",
    lineup: "Alejandro Llambías (voz) y Fernando López (bajo), con Andrés Mozzo, Germán Seoane y Matías Kramer, según Montevideo Portal (2015). Federico Delfino colaboró en la composición de varios temas, según la misma fuente.",
    links: [sources.diaria2015, sources.montevideoInsoportable, sources.soundcloudSet],
    tracks: [
      { title: "Ni Una Palabra" }, { title: "Molde" }, { title: "Contramano" }, { title: "Igual Que Ayer" },
      { title: "Interferencia" }, { title: "Insoportable" }, { title: "Deja Vu" }, { title: "Santos Inocentes" },
      { title: "Nada De Mi" }, { title: "Tiburon" }, { title: "Zombie En Mi Placard" }, { title: "No Va Mas" },
    ],
  },
];

export const bandProfile: { label: string; text: string; source: SourceLink }[] = [
  { label: "Origen y estilo", text: "Banda de Montevideo de hard rock. Su perfil la describe como power cuarteto, con influencias de AC/DC y Guns N' Roses.", source: sources.sietenotasProfile },
  { label: "Formación", text: "El perfil no fechado de SieteNotas lista como integrantes a Nacho Obes (voz y bajo), Matías Kramer (batería), Andrés Mozzo y Germán Seoane (guitarras). No detalla formaciones por época.", source: sources.sietenotasProfile },
  { label: "Estudio y técnicos", text: "“La Piel del Lobo” fue regrabada en Sondor con el técnico Daniel Baéz (Octopus), según el mismo perfil.", source: sources.sietenotasProfile },
  { label: "Radio en 2002", text: "Una versión rock de “Mi Bandera” sonó en la campaña “Contra el Bajón” de FM 93.9 Océano, según el perfil.", source: sources.sietenotasProfile },
  { label: "Escenarios", text: "El perfil enumera Flanagan's, la Fête de la Musique del Liceo Francés, Club Unión Shangrila, La Comisaría, Amarcord, Katar y Plaza Mateo.", source: sources.sietenotasProfile },
  { label: "Premios Graffiti", text: "Doberman ganó el premio a Revelación del año en 2006, listado como “Doberman – Doberman”. En 2012, “Tren calavera” ganó el premio a Mejor Álbum de Metal y Hard Rock.", source: sources.graffiti2006 },
  { label: "Sencillos de Tren Calavera", text: "Según Metrónomo (2026), “Blanco Perfecto”, “Animal”, “Tren Calavera” y “Morir Así” fueron los temas destacados del disco, y llevaron a la banda a su primera producción audiovisual de mayor escala.", source: sources.metronomoTren2026 },
  { label: "Expansión regional", text: "Según Metrónomo (2026), la banda comenzó a presentarse en Argentina y a recorrer el circuito regional. La nota no indica fechas.", source: sources.metronomoTren2026 },
  { label: "Discrepancia sobre la pausa", text: "Una entrevista a Nacho Obes publicada por Montevideo Portal el 22 de mayo de 2020 dice que Doberman se disolvió en 2014 y tuvo un breve regreso en 2018. Las notas de 2026 describen una pausa sin disolución formal demostrada. El archivo mantiene ambas versiones.", source: sources.montevideo2020Obes },
];

export const compilationXX = {
  title: "XX (Edición Especial 20 Años)",
  year: "2026",
  note: "Compilado retrospectivo de quince pistas que mezcla canciones de los tres álbumes históricos, remasterizaciones y dos bonus identificados como registro en vivo de 2012 y demo de 2003. No es un quinto álbum de estudio.",
  links: [sources.youtubeXX, sources.metronomo2026, sources.obesInterview],
  tracks: [
    "Actitud", "Perro Fiel (Remastered 2026)", "El Último En Pie (Remastered 2026)", "Animal", "Blanco Perfecto",
    "Entre Ceja y Ceja", "Eterno Boulevard (Remastered 2026)", "Bonanza (Remastered 2026)", "La Piel Del Lobo",
    "Un Vaso En Alto", "Morir Así", "Sangre De Perdedor", "Tren Calavera", "Perro Fiel (En Vivo 2012)", "Highway To Hell (2003)",
  ],
};

export const timeline = [
  { year: "2001", title: "Primeros ensayos", text: "Nacho Obes sitúa los ensayos iniciales en Montevideo; el dato proviene de su recuerdo retrospectivo.", source: sources.obesInterview },
  { year: "2002", title: "Nace Doberman", text: "Formación inicial asociada a Obes, Andrés Mozzo, Germán Seoane y Matías Kramer; demo de “La Piel del Lobo”.", source: sources.obesInterview },
  { year: "2005", title: "Debut homónimo", text: "Presentación del primer álbum independiente; “La Piel del Lobo” fue el corte de difusión documentado por prensa.", source: sources.elPais2005 },
  { year: "2007", title: "El Último En Pie", text: "Segundo álbum, con “Perro Fiel” como adelanto/corte de difusión mencionado en fuentes periodísticas.", source: sources.obesInterview },
  { year: "2010—2011", title: "Tren Calavera", text: "Grabado en 2010 y editado en 2011; el tercer álbum de la etapa de Obes.", source: sources.cooltivarteTren },
  { year: "2013—2015", title: "Nueva voz, nuevo disco", text: "Obes deja la banda en 2013. A fines de 2014 aparece Insoportable, con Alejandro Llambías y Fernando López; se presenta en 2015.", source: sources.diaria2015 },
  { year: "2026", title: "Regreso y catálogo reactivado", text: "DOBERMANXX anuncia actuaciones y reactiva el catálogo digital. Registramos lo anunciado y publicado, sin dar por hechos los planes futuros.", source: sources.instagram },
];

export type MediaItem = { title: string; type: string; year: string; description: string; sourceLabel: string; url: string; confidence: string; category: "Videoclips" | "En vivo" | "Álbum completo" | "Redes" };
export const mediaItems: MediaItem[] = [
  { title: "Blanco Perfecto", type: "Videoclip", year: "2011 · fecha del upload por confirmar", description: "El título del upload lo presenta como “Videoclip Oficial”. El canal/uploader no se autenticó de forma independiente; lo usamos como enlace de archivo, no como validación de derechos.", sourceLabel: "YouTube · atribución pendiente", url: "https://www.youtube.com/watch?v=wm_2XtoKa1E", confidence: "Atribución no verificada", category: "Videoclips" },
  { title: "Morir Así · Doberman 10 años", type: "Registro en vivo", year: "2012 · La Trastienda", description: "Video asociado al festejo de diez años. La ficha y el uploader deben seguir cotejándose con archivo de la banda.", sourceLabel: "YouTube · archivo de terceros", url: "https://www.youtube.com/watch?v=Fh4qCmASSss", confidence: "Fuente secundaria", category: "En vivo" },
  { title: "Tren Calavera · lista de álbum", type: "Álbum · 10 canciones seleccionables", year: "2011 · catálogo digital", description: "Reemplaza la subida continua que el usuario reportó como no disponible. Esta lista ofrece diez pistas individuales y permite elegir tema dentro del reproductor de YouTube.", sourceLabel: "YouTube · DOBERMAN - Topic / Tritono", url: sources.youtubeTren.url, confidence: "Catálogo de audio · canal auto-generado", category: "Álbum completo" },
  { title: "Animal", type: "Videoclip / canción", year: "2011 · Tren Calavera", description: "Video encontrado con créditos de producción en la descripción. No atribuimos titularidad o canal oficial sin verificación adicional.", sourceLabel: "YouTube · fuente audiovisual", url: "https://www.youtube.com/watch?v=qglJh6_YgO0", confidence: "Fuente por verificar", category: "Videoclips" },
  { title: "Un Vaso En Alto · Live on PardelionMusic.tv", type: "Sesión en vivo", year: "Sin fecha verificada", description: "Registro asociado a Nacho Obes y a Juan Bonavoglia; no se presenta como documento de la formación completa de Doberman.", sourceLabel: "YouTube · PardelionMusic.tv", url: "https://www.youtube.com/watch?v=b0BSGSpF2t8", confidence: "Fuente identificada", category: "En vivo" },
  { title: "DOBERMANXX · novedades y registros", type: "Redes de la etapa actual", year: "2026", description: "Perfil que se identifica como DOBERMANXX y publica anuncios/actualizaciones. La actividad futura no se infiere más allá de cada publicación fechada.", sourceLabel: "Instagram · @doberman.uy", url: "https://www.instagram.com/doberman.uy/", confidence: "Perfil de la etapa 2026", category: "Redes" },
];

export const pressItems = [
  { title: "Doberman presenta hoy su primer disco", outlet: "El País", date: "17 ago 2005", text: "Anuncio contemporáneo de la presentación del debut homónimo.", url: sources.elPais2005.url },
  { title: "El hombre de atrás", outlet: "la diaria", date: "08 may 2015", text: "Entrevista a Matías Kramer sobre el recambio de voz y el lanzamiento de Insoportable.", url: sources.diaria2015.url },
  { title: "Doberman presenta disco y responde la metralleta", outlet: "Montevideo Portal", date: "29 abr 2015", text: "Presenta Insoportable, describe doce temas y la difusión digital gratuita.", url: sources.montevideoInsoportable.url },
  { title: "Nacho Obes: Rockero Profesional", outlet: "SÓLO ROCK Uruguay", date: "20 abr 2026 · actualización 24 abr", text: "Testimonio extenso sobre la historia, los discos, la salida de Obes y la recuperación del catálogo.", url: sources.obesInterview.url },
  { title: "Doberman relanza Tren Calavera", outlet: "Cooltivarte", date: "11 may 2026", text: "Reedición digital, tercer disco de estudio y datos de la etapa de grabación.", url: sources.cooltivarteTren.url },
  { title: "Yo soy el fan número uno de mi banda", outlet: "la diaria", date: "06 jun 2026", text: "Notas sobre el regreso anunciado y la formación acompañante de DOBERMANXX.", url: sources.laDiariaComeback.url },
  { title: "Lanzamientos: Doberman y otros proyectos", outlet: "Metrónomo", date: "27 abr 2026", text: "Disponibilidad del catálogo y carácter retrospectivo del compilado XX.", url: sources.metronomo2026.url },
];

export const sourceDirectory = [
  { group: "Perfiles y distribución", items: [sources.instagram, sources.soundcloudProfile, sources.discogsArtist] },
  { group: "Fuentes periodísticas", items: [sources.obesInterview, sources.elPais2005, sources.diaria2015, sources.montevideoInsoportable, sources.laDiariaComeback, sources.elPaisComeback, sources.cooltivarteTren, sources.metronomo2026] },
  { group: "Catálogo y reproducciones", items: [sources.discogsDebut, sources.discogsUltimo, sources.discogsTren, sources.soundcloudSet, sources.youtubeDebut, sources.youtubeUltimo, sources.youtubeTren, sources.youtubeXX] },
];
