# A.N.I.M.A.L. — Archivo Audiovisual

## Implementación

Sitio web editorial responsive, sin base de datos en esta primera etapa. El catálogo vive en datos tipados dentro del frontend para permitir una primera publicación rápida y una futura migración a CMS, JSON versionado o base de datos. YouTube se integra de manera responsable con miniaturas, enlaces y embeds; no se descarga ni redistribuye material protegido.

La home concentra la experiencia de descubrimiento: hero audiovisual con embed de YouTube silenciado, manifiesto editorial, accesos a categorías, una selección de registros y una cronología resumida. El catálogo se consulta mediante búsqueda y filtros por categoría, etapa y nivel de verificación. Cada registro conserva por separado el año del registro y la fecha de publicación.

Estructura principal:

- `client/src/pages/Home.tsx`: experiencia editorial, catálogo, filtros y cronología.
- `client/src/index.css`: sistema visual oscuro, responsive y animaciones.
- `client/public/manus-routes.json`: manifiesto de rutas públicas.
- `sources/`: espacio reservado para futuras fichas y fuentes verificadas.
- `plan.md` y `TODO.md`: decisiones y alcance vivo del proyecto.

## Dirección visual

### Tres opciones consideradas

- Archivo de concreto y VHS: 0.07 — textura de archivo, rojo de alerta y composición de fanzine.
- **Metal editorial de fin de siglo: 0.86** — negro carbón, tipografía condensada, rojo vivo y capas de transmisión.
- Museo digital brutalista: 0.05 — blanco crudo, grilla rígida y contraste documental.

### Design Movement

Metal editorial de fin de siglo: una mezcla de archivo televisivo, afiche de recital y sala de escucha digital.

### Principios

1. La energía de la banda entra por la imagen, pero la información se lee con precisión.
2. El archivo distingue evidencia, procedencia y memoria; nunca presenta una conjetura como certeza.
3. La navegación se siente como recorrer una discoteca viva, no como completar un formulario.
4. Cada bloque debe poder crecer sin perder el hilo editorial.

### Color Philosophy

El negro carbón funciona como soporte de archivo nocturno. El rojo señaliza energía, acción y material confirmado. El hueso envejecido da una lectura editorial y evita el aspecto genérico de una interfaz negra. Los tonos verdes y ámbar quedan reservados para estados de verificación y procedencia.

### Layout Paradigm

Composición de manifiesto vertical: hero a sangre, bloques asimétricos, numeración lateral y una línea de tiempo que atraviesa la página. Se evita una grilla uniforme de tarjetas como estructura dominante.

### Signature Elements

- Etiquetas técnicas en mayúsculas con tracking amplio, como rótulos de archivo.
- Línea roja de señal que conecta hero, catálogo y cronología.
- Tarjetas de video con numeración, estado de verificación y miniatura como ficha de videoteca.

### Interaction Philosophy

La interfaz responde con desplazamientos cortos, subrayados rojos y estados visibles. Los filtros no esconden resultados: muestran cuántos registros quedan y explican la procedencia. El hover revela contexto, no solo decoración.

### Animation

Entrada suave del hero; scanlines y ruido muy sutiles; tarjetas que elevan 4px al pasar; timeline que marca el periodo activo sin parpadeo. Respeto por `prefers-reduced-motion`.

### Typography System

`Barlow Condensed` para titulares y numeración. `Space Grotesk` para interfaz y cuerpo. Las etiquetas técnicas usan `IBM Plex Mono`.

### Brand Essence

Un archivo audiovisual argentino para volver a mirar la historia de A.N.I.M.A.L. con energía y criterio. Directo, intenso, documental.

### Brand Voice

- “No es nostalgia: es evidencia en movimiento.”
- “Buscá por año, formación o procedencia. El archivo sigue abierto.”

### Wordmark & Logo

Wordmark basado en `A.N.I.M.A.L.` con puntos tratados como remaches de una placa metálica; el monograma `A/` funciona como marca compacta para navegación.

### Signature Brand Color

Rojo señal `#e7472e`, usado como hilo conductor y no como relleno masivo.
