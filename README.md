# DOBERMAN — Archivo abierto

Archivo editorial independiente sobre la banda uruguaya de hard rock Doberman. Reúne los álbumes y sus canciones, cronología, entrevistas, material audiovisual y enlaces a las fuentes, distinguiendo lo confirmado de lo que sigue en investigación.

La cola recorre cinco bloques en orden: los cuatro álbumes de estudio y el compilado retrospectivo *XX* de 2026. Cada canción del tracklist se puede elegir e iniciar dentro de la página. Los 61 cortes incluyen repeticiones y bonus del compilado; no son 61 canciones únicas. SoundCloud conserva su reproductor visual para *Insoportable*; los otros cuatro bloques usan listas de audio completas de YouTube/YouTube Music, con pistas individuales seleccionables. Al finalizar la última pista de un bloque, el sitio intenta avanzar al siguiente. Si el navegador o la plataforma bloquea el inicio o el pase automático, quedan controles manuales y un enlace a la fuente. La identidad DOBERMAN - Topic / Tritono no se presenta como administración directa de la banda. No se usan previews ni reproductores de Spotify.

## Desarrollo

- `pnpm dev:static`: Vite en modo desarrollo para el front-end estático (puerto 3000 por defecto).
- `pnpm run build:static`: compila el sitio público en `dist/public`.
- `pnpm check`: chequeo de TypeScript.
- `pnpm test`: pruebas disponibles del repo.

Vercel usa `vercel.json` para publicar `dist/public` con fallback para la SPA. La base del sitio sigue siendo estática y no requiere base de datos.

**Chat con IA (`api/chat.ts`).** La sección "Preguntale al archivo" llama a una función serverless en `/api/chat`, que consulta el modelo `gemini-3.1-flash-lite` de la API de Google con el contenido de `client/src/data/doberman.ts` como contexto. Requiere una variable de entorno en Vercel (Settings → Environment Variables):

- `GEMINI_API_KEY`: clave de Google AI Studio. Nunca la pongas en el código ni en el repo.

Sin esa variable, el chat muestra un mensaje de "no configurado" y el resto de la página funciona igual. Hay un límite de 20 consultas por hora por IP, de mejor esfuerzo porque la memoria de cada instancia no es compartida. Para un tope real de gasto, configurá un límite mensual en la consola de Google Cloud. Los embeds de video y audio permanecen en el proveedor de origen; no se descargan ni distribuyen canciones o videos. Las listas Topic son entregas de catálogo auto-generadas; una pista puede no estar disponible en ciertas regiones o dispositivos.

## Estructura

- `client/src/pages/Home.tsx`: navegación, portada y tracklists que abren la canción elegida en el reproductor de la página.
- `client/src/components/PlaybackQueuePlayer.tsx`: embeds de YouTube y SoundCloud, selección de pistas y avance al siguiente bloque.
- `client/src/data/doberman.ts`: discos, canciones, cronología, audiovisuales, prensa y fuentes.
- `client/src/data/playlist.ts`: IDs de cada pista, lista SoundCloud, secuencia y cobertura por bloque.
- `client/src/index.css`: identidad visual, estados de selección, responsive, movimiento y accesibilidad.
- `client/public/archive/`: material visual archivístico con atribución en la interfaz.
- `sources/`: notas y referencias editoriales.

El repo conserva su historial previo. El contenido del sitio y el nombre del paquete se orientan ahora a Doberman; el slug remoto no se cambia para evitar interrumpir la integración actual con Vercel.
