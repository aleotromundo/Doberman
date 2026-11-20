// Genera client/public/archive-context.json a partir de los datos del archivo.
// Lo corre `pnpm run build:static` antes de compilar el sitio; la función /api/chat lo lee desde el propio dominio.
import { writeFileSync } from "node:fs";
import { albums, bandProfile, compilationXX, pressItems, sourceDirectory, timeline } from "../client/src/data/doberman";

const data = {
  perfil: bandProfile.map(({ label, text, source }) => ({ tema: label, texto: text, fuente: source.url })),
  discos: albums.map((album) => ({
    titulo: album.title,
    año: album.year,
    nota: album.note,
    confianza: album.confidence,
    formacion: album.lineup,
    creditos: album.credits,
    temas: album.tracks.map((track) => (track.note ? `${track.title} (${track.note})` : track.title)),
  })),
  compilado: { titulo: compilationXX.title, año: compilationXX.year, nota: compilationXX.note, temas: compilationXX.tracks },
  cronologia: timeline.map((item) => ({ año: item.year, titulo: item.title, texto: item.text, fuente: item.source.url })),
  prensa: pressItems.map((item) => ({ titulo: item.title, medio: item.outlet, fecha: item.date, texto: item.text, url: item.url })),
  fuentes: sourceDirectory.flatMap((group) => group.items.map((item) => ({ nombre: item.label, url: item.url }))),
};

writeFileSync("client/public/archive-context.json", JSON.stringify(data));
console.log("archive-context.json generado");
