import { getAllPiezas } from '../lib/content';

function buildLinks(piezas) {
  const links = [];
  for (let i = 0; i < piezas.length; i++) {
    for (let j = i + 1; j < piezas.length; j++) {
      const a = piezas[i];
      const b = piezas[j];
      let weight = 0;
      if (a.tema && b.tema && a.tema === b.tema) weight += 3;
      if (a.industria && b.industria && a.industria === b.industria) weight += 2;
      const sharedMecanismos = a.mecanismo.filter(m => b.mecanismo.includes(m));
      weight += sharedMecanismos.length;
      if (a.seccion === b.seccion) weight += 1;
      if (weight > 0) {
        links.push({ source: a.href, target: b.href, weight });
      }
    }
  }
  return links;
}

const piezas = getAllPiezas();
const links = buildLinks(piezas);

console.log('--- VERIFICACIÓN DE RED ---');
console.log('Total piezas cargadas:', piezas.length);
console.log('Links generados:', links.length);
console.log('---------------------------');
