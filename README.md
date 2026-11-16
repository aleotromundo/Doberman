# DOBERMAN — Archivo abierto

Archivo editorial independiente sobre la banda uruguaya de hard rock Doberman. Reúne los álbumes y sus canciones, cronología, entrevistas, material audiovisual y enlaces a las fuentes, distinguiendo lo confirmado de lo que sigue en investigación.

La portada incluye una cola cronológica de cinco bloques: cuatro álbumes de estudio con 46 temas y el compilado *XX* de 2026 con 15 cortes. Al terminar cada bloque, el sitio intenta continuar con el siguiente aunque cambie de YouTube a Spotify o SoundCloud. Los 61 cortes incluyen repeticiones y bonus de *XX*; no son 61 canciones únicas. YouTube y SoundCloud informan el final de sus videos o sets. Spotify no garantiza un evento de fin de álbum: la cola espera señales del inicio de las pistas y estima el fin al recibir una pausa en los últimos 400 ms; si se saltea el disco o faltan eventos, el pase puede no ocurrir, y una pausa manual justo allí también podría avanzarlo. El navegador o una sesión no autenticada pueden bloquear autoplay; queda un control “Siguiente bloque” de respaldo.

## Desarrollo

- `pnpm dev:static`: Vite en modo desarrollo para el front-end estático (puerto 3000 por defecto).
- `pnpm run build:static`: compila el sitio público en `dist/public`.
- `pnpm check`: chequeo de TypeScript.
- `pnpm test`: pruebas disponibles del repo.

Vercel usa `vercel.json` para publicar `dist/public` con fallback para la SPA. La home no requiere servidor, base de datos ni credenciales. Los embeds de video y audio permanecen en el proveedor de origen; no se descargan ni distribuyen canciones o videos. Las subidas de YouTube con uploader no autenticado se identifican como tales; Spotify puede pedir iniciar sesión o tocar Play desde sus controles.

## Estructura

- `client/src/pages/Home.tsx`: navegación, portada y cola interactiva de escucha.
- `client/src/components/PlaybackQueuePlayer.tsx`: eventos de fin y cambio automático de bloque en YouTube, SoundCloud y Spotify.
- `client/src/data/doberman.ts`: discos, temas, cronología, audiovisuales, prensa y fuentes.
- `client/src/data/playlist.ts`: bloques cronológicos y reproductores disponibles.
- `client/src/index.css`: identidad visual, responsive, movimiento y accesibilidad.
- `client/public/archive/`: material visual archivístico con atribución en la interfaz.
- `sources/`: notas y referencias editoriales.

El repo conserva su historial previo. El contenido del sitio y el nombre del paquete se orientan ahora a Doberman; el slug remoto no se cambia para evitar interrumpir la integración actual con Vercel.
