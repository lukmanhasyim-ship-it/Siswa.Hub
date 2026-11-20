const fs = require('fs');
const path = require('path');

const uaDir = path.join(process.argv[2], '.ua');
const raw = JSON.parse(fs.readFileSync(path.join(uaDir, 'intermediate', 'scan-raw.json'), 'utf8'));
const imports = JSON.parse(fs.readFileSync(path.join(uaDir, 'intermediate', 'import-map.json'), 'utf8'));

const result = {
  ...raw,
  name: 'Siswa.Hub',
  description: 'Platform manajemen kelas digital serverless berbasis React dan Google Workspace untuk wali kelas: presensi, kas, catatan terlambat, panggilan orang tua, piket, leger, dan laporan.',
  readmeHead: fs.readFileSync(path.join(process.argv[2], 'README.md'), 'utf8').slice(0, 3000),
  frameworks: ['React', 'Vite', 'React Router', 'TanStack Query', 'Tailwind CSS', 'Firebase Hosting', 'Google Apps Script', 'PWA'],
  languages: Object.keys(raw.stats.byLanguage),
  importMap: imports.importMap,
};

fs.writeFileSync(path.join(uaDir, 'intermediate', 'scan-result.json'), JSON.stringify(result, null, 2));
console.log(`Scan result: ${result.totalFiles} files, ${Object.keys(result.importMap).length} import entries`);
