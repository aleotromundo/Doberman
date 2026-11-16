# DOBERMAN — Archivo abierto

## Alcance editorial y técnico

El proyecto reutiliza el front-end React/Vite del repo existente y lo convierte en un archivo independiente sobre la banda uruguaya de hard rock Doberman. La experiencia es estática y pública: no requiere cuentas, servidor ni base de datos. Los datos editoriales se mantienen tipados en `client/src/data/doberman.ts`; cada afirmación mantiene enlaces y notas de certeza cuando hay variantes.

El archivo cubre los cuatro álbumes de estudio —*Doberman* (2005), *El Último En Pie* (2007), *Tren Calavera* (2011) e *Insoportable* (2014, presentado en 2015)— y separa el compilado *XX (Edición Especial 20 Años)* (2026). Reúne tracklists, archivo audiovisual, entrevistas, prensa, cronología y fuentes. El inventario es amplio y trazable, pero no afirma que cubre literalmente todo Internet; las lagunas quedan indicadas.

## Dirección visual

- **Dirección:** archivo musical nocturno y minimalista; tipografía editorial condensada, imagen documental y pocos elementos de interfaz.
- **Principios:** primero la música y los archivos; navegación simple; datos con fuentes visibles; incertidumbre expresada con honestidad; lectura rápida en móvil.
- **Paleta:** carbón y grafito como fondo, blanco cálido para lectura, rojo óxido para acciones y ámbar para notas de archivo. El rojo se usa en pequeñas dosis.
- **Composición:** portada audiovisual a sangre con video de fondo silenciado; texto de alto contraste; secciones editoriales asimétricas, discografía por álbum y cronología lineal.
- **Elementos distintivos:** wordmark tipográfico DOBERMAN, marca breve `D/`, etiquetas de año/procedencia, artes de portadas con crédito.
- **Interacción:** navegación por anclas y búsqueda; cada título del tracklist funciona como control para elegir y reproducir esa canción dentro de un diálogo único; cola por álbum con continuidad por proveedor.
- **Movimiento:** video ambiental silenciado con imagen de respaldo; desactivación cuando `prefers-reduced-motion` está activo. Animación suave de entrada y hover, sin parpadeo.
- **Tipografía:** Barlow Condensed para títulos y numeración; Space Grotesk para cuerpo; IBM Plex Mono para etiquetas técnicas.
- **Esencia y voz:** archivo independiente para volver a escuchar y ubicar la historia de Doberman; directo, oscuro y cuidadoso. Rioplatense, breve y sin marketing inflado: “El ruido quedó registrado” / “Cuatro discos. Cada tema, con su rastro”.
- **Marca gráfica:** DOBERMAN en tipografía condensada y `D/` como marca secundaria; no se sugiere afiliación oficial.

## Discografía y fuentes de escucha

La discografía de estudio suma 46 temas en cuatro álbumes; *XX* agrega 15 pistas retrospectivas, para 61 cortes en la cola con repeticiones, remasterizaciones y bonus. Se conservan las variantes de título cuando las fuentes difieren. *Insoportable* es el cuarto álbum documentado, editado a fines de 2014 y presentado en 2015. La relación con el trabajo sin edición física citado por Nacho Obes es probable por cronología y formato digital, pero no explícita en la entrevista.

Se prioriza SoundCloud donde hay un set completo: *Insoportable* con 12 pistas. No se encontró un set SoundCloud verificable para los otros cuatro bloques. Para ellos se usan listas de audio de YouTube/YouTube Music atribuidas a DOBERMAN - Topic, con pistas individuales de duración completa. La atribución Topic/Tritono es visible, pero no prueba que la cuenta sea administrada directamente por la banda. No se usan embeds ni previews de Spotify. Las fuentes actuales y sus límites están registrados en `sources/doberman-playback.md`.

Los tracklists se vuelven selectores internos: el botón de canción inicia la pista elegida sin salir del sitio. El reproductor SoundCloud conserva su visualización y selecciona por índice (`skip`). El reproductor de YouTube usa la lista ordenada de IDs de audio y `loadPlaylist(ids, index)`; `getPlaylistIndex()` identifica el tema actual, y el pase entre bloques ocurre al terminar el último. Los proveedores alojan y entregan su propio audio; el sitio no descarga canciones. El upload continuo de *Tren Calavera* que el usuario reportó como no disponible se retira del reproductor y se reemplaza por la lista de álbum de 10 pistas.

## Fuentes y límites de atribución

Las fuentes de banda, plataformas, prensa y catálogos colaborativos se distinguen por tipo. “Oficial” solo se usa cuando la fuente o el propio upload lo declara; no se equipara la presencia de DOBERMAN - Topic con control de la cuenta por integrantes. No se reproducen letras ni se descargan o vuelven a alojar canciones o videos. El sitio no reemplaza ni representa a la banda.

## Estructura

- `client/src/pages/Home.tsx`: portada, navegación, tracklists seleccionables y diálogo de escucha.
- `client/src/components/PlaybackQueuePlayer.tsx`: embeds de YouTube y SoundCloud; selección y eventos por pista/bloque.
- `client/src/data/doberman.ts`: discos, canciones, cronología, audiovisuales, prensa, perfiles y fuentes.
- `client/src/data/playlist.ts`: IDs de canciones/listas, set SoundCloud, secuencia y cobertura por bloque.
- `client/src/index.css`: identidad visual, listas con estados seleccionados, responsive, movimiento y accesibilidad.
- `client/public/archive/`: artes de portadas con atribución en la interfaz.
- `client/index.html`: metadatos y contenido de respaldo legible antes de ejecutar React.
- `client/public/manus-routes.json`: ruta pública raíz.
- `sources/`: notas de investigación y referencias editoriales.
- `vercel.json`: build Vite estático desde `dist/public`, fallback SPA y caché de assets.

## Entrega

Se conserva el stack y lockfile existentes. Vercel compila el front-end mediante `pnpm run build:static` y publica `dist/public`; no se agregan servicios de base de datos, OAuth ni claves. La publicación va al repo existente y a la rama `main`, conservando el historial. El slug remoto no se renombra porque podría interrumpir su vínculo actual con Vercel.
