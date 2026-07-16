const fs = require('fs');
const files = [
  'app/volumenes/[id]/page.tsx',
  'app/volumenes/page.tsx',
  'components/PiecePage.tsx',
  'components/GlobalMenu.tsx',
  'components/NetworkMap.tsx'
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf-8');
  content = content.replace(/TEMPORADAS/g, 'VOLUMENES');
  content = content.replace(/TEMPORADA_COLORS/g, 'VOLUMEN_COLORS');
  fs.writeFileSync(f, content, 'utf-8');
});
console.log('Fixed imports');
