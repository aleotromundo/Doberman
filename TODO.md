# DOBERMAN — Archivo abierto: estado de entrega

## Portada inmersiva y navegación
- [x] La portada identifica el proyecto únicamente como DOBERMAN / Archivo abierto y no lo presenta como sitio oficial de la banda.
- [x] La portada usa un video real de la banda como fondo silenciado, conserva una imagen alternativa y acredita el enlace original; el video se oculta si el navegador solicita movimiento reducido.
- [x] La estética es moderna, minimalista y oscura, con contraste y navegación responsive para móvil y escritorio.
- [x] La navegación llega a discografía, archivo audiovisual, cronología, entrevistas y fuentes mediante anclas existentes.

## Discografía y escucha continua
- [x] El archivo incluye *Doberman* (2005), *El Último En Pie* (2007), *Tren Calavera* (grabado en 2010 y editado en 2011) e *Insoportable* (editado a fines de 2014 y presentado en 2015).
- [x] Cada álbum muestra los títulos de canciones en el orden respaldado por las fuentes y enlaza solo a reproducciones identificadas.
- [x] El sitio distingue las etapas de formación: *Insoportable* corresponde al período posterior a la salida de Nacho Obes; la entrevista de Obes no nombra explícitamente el disco al hablar de un trabajo posterior sin edición física.
- [x] Se señalan las variantes “Toby Tomas” / “Tomy Tobas” y “Solo Una Voz” / “Una Sola Voz” sin escoger arbitrariamente una sola grafía.
- [x] *XX (Edición Especial 20 Años)* (2026) aparece como compilado retrospectivo de quince pistas, no como álbum de estudio, y se incluye al final de la cola.
- [x] Una sola cola organiza cinco bloques cronológicos y sus 61 cortes —46 del catálogo de estudio y 15 del compilado, con repeticiones—. YouTube y SoundCloud informan el final; Spotify espera los eventos de inicio de sus pistas y estima el fin de bloque con una señal de pausa, sin garantía si se saltean temas o faltan eventos. El control “Siguiente bloque” queda de respaldo.
- [x] Se distinguen grabación, edición original, presentación en vivo y reedición digital cuando las fuentes lo permiten.

## Archivo audiovisual, prensa y cronología
- [x] El archivo incluye videoclips, registros en vivo, álbum completo en YouTube y material de redes, con fuente, fecha aproximada y límites de autenticidad visibles.
- [x] Los videos y el audio se incrustan o enlazan desde sus plataformas originales; no se descargan ni redistribuyen.
- [x] La prensa incluye entrevistas y anuncios relevantes, con medio, fecha y atribución de cada declaración.
- [x] La cronología cubre ensayos de 2001, formación en 2002, discos, cambios de integrantes, etapa posterior a 2013 y reactivación promocionada en 2026.
- [x] El estado actual se describe según evidencia fechada; planes no se presentan como eventos realizados ni se afirma continuidad futura no verificada.

## Fuentes, accesibilidad y publicación
- [x] Las afirmaciones históricas y tracklists enlazan fuentes próximas al contenido; catálogos colaborativos, plataformas y prensa no se presentan como primarios cuando no lo son.
- [x] El contenido distingue hechos, atribuciones y dudas; no promete exhaustividad literal de todo Internet y conserva lagunas para futuras búsquedas.
- [x] La búsqueda encuentra álbumes, canciones y piezas audiovisuales; prensa y cronología están disponibles desde sus secciones con enlaces a la fuente.
- [x] La interfaz tiene foco visible, nombres accesibles, navegación de teclado y foco contenido/restaurado en el diálogo de reproducción; respeta `prefers-reduced-motion`.
- [x] El HTML inicial incluye título y descripción; Vercel tiene build estático y fallback SPA desde `dist/public`.
- [x] `pnpm check`, `pnpm test` y `pnpm run build:static` pasan; `git diff --check` no encuentra errores.
- [ ] Publicar los cambios en `main` del repo existente y confirmar que Vercel genera el despliegue.
