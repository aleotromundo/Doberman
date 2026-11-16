# DOBERMAN — Archivo abierto

## Alcance editorial y técnico

El proyecto reutiliza el front-end React/Vite del repo existente y lo convierte en un archivo independiente sobre la banda uruguaya de hard rock Doberman. La experiencia es estática y pública: no requiere cuentas, servidor ni base de datos en esta etapa. Los datos editoriales se mantienen tipados y versionados en `client/src/data/doberman.ts`; cada grupo de afirmaciones incluye enlaces a la fuente que lo respalda y notas de certeza cuando hay variantes.

El archivo cubre los cuatro álbumes documentados —*Doberman* (2005), *El Último En Pie* (2007), *Tren Calavera* (2011) e *Insoportable* (2014, presentado en 2015)— y separa el compilado *XX (Edición Especial 20 Años)* (2026). Las secciones reúnen tracklists, audiovisual enlazado o embebido, entrevistas y prensa, cronología de integrantes/etapas y fuentes. El inventario es amplio y trazable, pero no afirma que “todo Internet” fue cubierto; las lagunas quedan indicadas.

## Dirección visual

- **Dirección:** archivo musical nocturno y minimalista; tipografía editorial condensada, imagen documental y pocos elementos de interfaz.
- **Principios:** primero la música y los archivos; navegación simple; datos con fuentes visibles; incertidumbre expresada con honestidad; lectura rápida en móvil.
- **Paleta:** carbón y grafito como fondo, blanco cálido para lectura, rojo óxido para acciones y ámbar para notas de archivo. El rojo se usa en pequeñas dosis.
- **Composición:** portada audiovisual a sangre con video de fondo silenciado; texto de alto contraste; secciones editoriales asimétricas, discografía por álbum y cronología lineal. No depender de una grilla uniforme de tarjetas.
- **Elementos distintivos:** wordmark tipográfico DOBERMAN, marca breve `D/`, etiquetas de año/procedencia, artes de portadas con crédito y enlace a la ficha de origen.
- **Interacción:** navegación por anclas; búsqueda de álbumes, canciones y piezas; tracklists desplegables; cola única ordenada por fecha que cambia entre reproductores de plataformas distintas.
- **Movimiento:** video ambiental silenciado con imagen de respaldo; desactivación cuando `prefers-reduced-motion` está activo. Animación suave de entrada y hover, sin parpadeo.
- **Tipografía:** Barlow Condensed para títulos y numeración; Space Grotesk para cuerpo; IBM Plex Mono para etiquetas técnicas.
- **Esencia y voz:** archivo independiente para volver a escuchar y ubicar la historia de Doberman; directo, oscuro y cuidadoso. Rioplatense, breve y sin marketing inflado: “El ruido quedó registrado” / “Cuatro discos. Cada tema, con su rastro”.
- **Marca gráfica:** DOBERMAN en tipografía condensada y `D/` como marca secundaria; no se inventa un símbolo canino ni se sugiere afiliación oficial.

## Contenido y evidencia

La discografía de estudio suma 46 temas distribuidos en cuatro álbumes. Se conservan variantes de título donde las fuentes difieren; no se corrige una grafía sin evidencia. *XX* se presenta como compilado retrospectivo de 15 pistas, no como quinto álbum de estudio. La cola de escucha reúne esos 46 cortes y agrega el compilado como bloque final; el total de 61 incluye repeticiones, remasterizaciones y bonus, no equivale a 61 canciones inéditas. *Insoportable* se presenta como cuarto álbum documentado de 2014, presentado en vivo en 2015. Que sea el trabajo sin edición física al que alude Nacho Obes en 2026 es una identificación razonable por cronología y formato digital, pero no una identificación textual explícita en esa entrevista.

Las fuentes de banda, plataformas, prensa y catálogos colaborativos se distinguen por tipo. “Oficial” solo se usa cuando la fuente o el propio upload lo declara; la autenticidad de algunos uploaders queda abierta. No se reproducen letras ni se descargan canciones o videos protegidos. El sitio no reemplaza ni representa a la banda.

## Escucha continuada desde la portada

El botón Play abre una única cola cronológica con cinco bloques: los cuatro álbumes de estudio y el compilado *XX* de 2026. Al llegar al final de un bloque, el reproductor intenta iniciar el siguiente aunque la fuente cambie de YouTube a Spotify o SoundCloud. El [API de YouTube](https://developers.google.com/youtube/iframe_api_reference) expone el estado `ENDED`; el [widget de SoundCloud](https://developers.soundcloud.com/docs/api/html5-widget) emite `FINISH` y permite consultar el índice de la última pista; el [iFrame API de Spotify](https://developer.spotify.com/documentation/embeds/references/iframe-api) informa cambios de reproducción y permite solicitar `play()`.

El paso automático depende de que cada proveedor exponga el evento y de que el navegador permita autoplay. Spotify no ofrece una señal inequívoca de fin de álbum en el embed: el sitio espera haber recibido eventos de inicio para todas las pistas y usa como mejor esfuerzo una actualización en pausa dentro de los últimos 400 ms del tema. Si se saltea parte del disco o faltan eventos, puede no avanzar; una pausa manual exactamente al final también podría confundirse con el fin del bloque. Spotify puede requerir iniciar sesión o tocar Play dentro del embed. El botón “Siguiente bloque” queda como respaldo si una política del navegador, el acceso o una falla de red impide el pase automático. No se descargan ni se vuelven a alojar las pistas.

## Estructura

- `client/src/pages/Home.tsx`: portada, navegación y secciones interactivas.
- `client/src/components/PlaybackQueuePlayer.tsx`: embeds y eventos de fin de YouTube, Spotify y SoundCloud.
- `client/src/data/doberman.ts`: discos, canciones, cronología, audiovisuales, prensa, perfiles y fuentes con URLs.
- `client/src/data/playlist.ts`: secuencia de escucha y reproductores disponibles por bloque.
- `client/src/index.css`: identidad visual, responsive, movimiento y accesibilidad.
- `client/public/archive/`: artes e imagen editorial con atribución en la interfaz.
- `client/index.html`: metadatos y contenido de respaldo legible antes de ejecutar React.
- `client/public/manus-routes.json`: ruta pública raíz.
- `sources/`: notas de investigación y referencias editoriales.
- `vercel.json`: build Vite estático desde `dist/public`, fallback SPA y caché de assets.

## Entrega

Se conserva el stack y lockfile existentes. Vercel compila el front-end mediante `pnpm run build:static` y publica `dist/public`; no se agregan servicios de base de datos, OAuth ni claves. La publicación va al repo existente y a la rama `main`, conservando el historial. El slug remoto no se renombra en este cambio porque podría interrumpir su vínculo actual con Vercel.
