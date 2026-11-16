# DOBERMAN — Archivo abierto: estado de entrega

## Portada inmersiva y navegación
- [x] La portada identifica el proyecto como archivo independiente de Doberman, no como sitio oficial.
- [x] Video de fondo silenciado, imagen alternativa, crédito y respeto por `prefers-reduced-motion`.
- [x] Estética oscura y responsive; foco visible, navegación por teclado y diálogo accesible.
- [x] Anclas a discografía, archivo audiovisual, cronología, entrevistas y fuentes.

## Discografía y reproducción por canción
- [x] Cuatro álbumes de estudio: *Doberman* (2005), *El Último En Pie* (2007), *Tren Calavera* (2011) e *Insoportable* (2014; presentado en 2015).
- [x] *XX (Edición Especial 20 Años)* de 2026 está separado como compilado retrospectivo, no como quinto álbum.
- [x] Las variantes de títulos y atribución están señaladas, no unificadas arbitrariamente.
- [x] Cada canción se puede elegir desde el tracklist del álbum y desde la cola; el reproductor y la lista reflejan el tema seleccionado sin salir de la página.
- [x] SoundCloud conserva su player visual y selector para las doce pistas de *Insoportable*.
- [x] Los otros cuatro bloques usan listas completas de audio YouTube/YouTube Music, con sus IDs por canción ordenados; no se usan previews ni embeds de Spotify.
- [x] El video continuo de *Tren Calavera* reportado como no disponible se retiró del sitio y se reemplazó por una playlist alternativa de diez canciones.
- [x] El final de un bloque intenta continuar al siguiente; hay control manual de respaldo ante bloqueos del proveedor o del navegador.
- [x] Los límites de catálogo, autenticidad y reproducción están registrados en `sources/doberman-playback.md`.

## Archivo, cronología y atribución
- [x] Prensa, entrevistas, cronología y audiovisuales enlazan a sus fuentes; se distinguen fuentes primarias, catálogos y atribuciones inciertas.
- [x] Los cambios de formación y la etapa posterior a 2013 aparecen en el archivo; *Insoportable* está identificado como cuarto álbum documentado.
- [x] No se afirma que se recopiló literalmente todo Internet ni se presentan planes anunciados como eventos realizados.
- [x] El HTML inicial tiene título y descripción; Vercel mantiene build estático y fallback SPA en `dist/public`.

## Validación y publicación
- [x] `pnpm check`, `pnpm test`, `pnpm run build:static` y `git diff --check` pasan.
- [x] El preview muestra los cinco bloques/61 cortes; se verificó la selección de un tema YouTube y el embed SoundCloud con índice de pista.
- [x] El código visible no conserva el enlace del video roto ni reproductores o enlaces Spotify.
- [x] El commit `6ddc632` está publicado en `main`; Vercel reporta despliegue completo y el dominio actual sirve el bundle nuevo con HTTP 200.
