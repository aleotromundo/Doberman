# Fuentes de reproducción por canción — Doberman

*Insoportable* tiene un set de doce canciones en SoundCloud con selector propio. No se encontraron sets verificables para los otros tres álbumes de estudio ni para el compilado *XX*. En esos bloques hay listas de catálogo en YouTube y YouTube Music con las pistas individuales y sus duraciones completas. Las páginas muestran atribución a DOBERMAN - Topic y entrega de Tritono, pero eso no demuestra que la banda administre directamente la cuenta. La comprobación revisó listas, títulos y duraciones; no una escucha manual hasta el final de cada tema. [1] [2] [3] [4] [5]

El video continuo anterior de *Tren Calavera* puede aparecer como “no disponible”. Aunque una extracción automatizada devolvió contenido, el archivo lo retira del reproductor principal y usa en su lugar la playlist de diez pistas. [6] [7]

## Fuentes integradas

- *Doberman* (2005): lista de doce pistas y orden de catálogo. El tracklist de la plataforma presenta algunas grafías distintas a la edición CD; se conserva el orden de reproducción y la grafía editorial del álbum. [2] [8]
- *El Último En Pie* (2007): lista de doce remasterizaciones distribuidas en 2026; no se presenta como captura de la edición original. La pista 10 aparece como “Si Pudiera” en YouTube, frente a “Si Pudieras” en la ficha del CD. [3] [9]
- *Tren Calavera* (2011): lista de diez audios atribuidos a DOBERMAN - Topic / Tritono. La última pista aparece como “Una Sola Voz”, variante de “Solo Una Voz” en la edición CD. [4] [10]
- *Insoportable* (2014): set de doce cortes en orden, con 36:38 de duración indicada. El perfil se identifica como `..::DOBERMAN::..` y Montevideo, aunque su titularidad oficial no está comprobada independientemente. La prensa contemporánea confirma el álbum y sus doce temas. [1] [11] [12]
- *XX (Edición Especial 20 Años)* (2026): lista de quince pistas. Es un compilado retrospectivo, no un álbum de estudio adicional. [5] [13]

## Integración en el sitio

Los tracklists son selectores internos: elegir un título abre ese tema en el reproductor de la página. Para YouTube, `client/src/data/playlist.ts` mantiene los IDs de video ordenados; el reproductor usa `loadPlaylist(videoIds, index)` para cargar desde la canción elegida y el avance interno de la lista continúa tema por tema. El set de *Insoportable* se reproduce con el widget visual de SoundCloud y `skip(index)` permite saltar a la pista elegida. El fin de YouTube se detecta con `getPlaylistIndex()` y el estado `ENDED`; SoundCloud comunica `FINISH`. Al finalizar el último tema, el sitio intenta iniciar el siguiente bloque. El navegador puede bloquear autoplay y algunos proveedores pueden restringir pistas por región; el sitio conserva controles manuales y enlaces al origen. [14] [7]

La cola no usa previews ni embeds de Spotify. Las plataformas controlan la entrega y las restricciones regionales; la página no descarga ni vuelve a alojar audio.

## Referencias

[1]: https://soundcloud.com/dobermanrocks/sets/insoportable "SoundCloud — Insoportable"
[2]: https://www.youtube.com/playlist?list=OLAK5uy_kr9cbBok5cEMFDAkUNZLX4cyqWMo9j6Hg "YouTube — Doberman, álbum de 2005"
[3]: https://www.youtube.com/playlist?list=OLAK5uy_niHZpbtYf8KBdGRKF3i0nZ0wIy_N0FmdQ "YouTube — El Último En Pie, remasterización"
[4]: https://www.youtube.com/playlist?list=OLAK5uy_ncHm-bh6bd08a-QiNRDFFB5244Bug1Uhw "YouTube — Tren Calavera"
[5]: https://www.youtube.com/playlist?list=OLAK5uy_k8L20q25r2rovED60JcB4Ek6eccwOW868 "YouTube — XX, Edición Especial 20 Años"
[6]: https://www.youtube.com/watch?v=IbHvpIdGwS8 "YouTube — subida anterior de Tren Calavera"
[7]: https://developers.google.com/youtube/iframe_api_reference "YouTube IFrame Player API"
[8]: https://www.discogs.com/release/11137878-Doberman-Doberman "Discogs — edición CD de Doberman"
[9]: https://www.discogs.com/release/11416414-Doberman-El-%C3%9Altimo-En-Pie "Discogs — edición CD de El Último En Pie"
[10]: https://www.discogs.com/release/14554835-Doberman-Tren-Calavera "Discogs — edición CD de Tren Calavera"
[11]: https://ladiaria.com.uy/articulo/2015/5/el-hombre-de-atras/ "la diaria — entrevista a Matías Kramer"
[12]: https://www.montevideo.com.uy/Archivo/Doberman-presenta-disco-y-responde-la-metralleta-uc269531 "Montevideo Portal — presentación de Insoportable"
[13]: https://metronomo.uy/2026/04/27/lanzamientos-doberman-rodra-ft-flor-sakeo-carlos-casacuberta-ft-martin-rivero-paul-higgs-y-el-color-ausente/ "Metrónomo — catálogo y compilado XX"
[14]: https://developers.soundcloud.com/docs/api/html5-widget "SoundCloud Widget API"
