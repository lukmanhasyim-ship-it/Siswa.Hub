const fs = require('fs');
const path = require('path');
const ua = process.argv[2];
const inter = path.join(ua, 'intermediate');
const graph = JSON.parse(fs.readFileSync(path.join(inter, 'assembled-graph.json'), 'utf8'));
const tour = JSON.parse(fs.readFileSync(path.join(inter, 'tour.normalized.json'), 'utf8'));
const validOrders = new Set(tour.map(s => s.order));
const fileTypes = new Set(['file', 'config', 'document', 'service', 'pipeline', 'table', 'schema', 'resource', 'endpoint']);
const fileNodes = graph.nodes.filter(n => fileTypes.has(n.type) && n.filePath);
const byPath = new Map(fileNodes.map(n => [n.filePath, n]));

const merged = {};
const warnings = [];
for (let i = 1; i <= 4; i++) {
  const file = path.join(inter, `code-lessons.detailed.${i}.json`);
  if (!fs.existsSync(file)) continue;
  const doc = JSON.parse(fs.readFileSync(file, 'utf8'));
  const files = doc.files || doc;
  for (const [fp, entry] of Object.entries(files)) {
    if (Object.prototype.hasOwnProperty.call(merged, fp)) {
      warnings.push(`Duplicate lesson key ${fp} in batch ${i}; kept first`);
      continue;
    }
    merged[fp] = entry;
  }
}

const overviewOnly = [];
for (const [fp, entry] of Object.entries(merged)) {
  if (!byPath.has(fp)) {
    delete merged[fp];
    continue;
  }
  const node = byPath.get(fp);
  const sections = Array.isArray(entry.sections) ? entry.sections : [];
  const kept = [];
  for (const s of sections) {
    if (!s || typeof s.title !== 'string' || !s.title.trim() || typeof s.explanation !== 'string') continue;
    const lr = s.lineRange;
    if (!Array.isArray(lr) || lr.length !== 2 || !Number.isInteger(lr[0]) || !Number.isInteger(lr[1]) || lr[0] < 1 || lr[0] > lr[1]) continue;
    const out = { title: s.title, lineRange: [lr[0], lr[1]], explanation: s.explanation };
    if (s.tourOrder !== undefined) {
      if (!Number.isInteger(s.tourOrder) || !validOrders.has(s.tourOrder)) continue;
      out.tourOrder = s.tourOrder;
    }
    kept.push(out);
    if (kept.length >= 10) break;
  }
  merged[fp] = {
    overview: typeof entry.overview === 'string' && entry.overview.trim() ? entry.overview : node.summary,
    sections: kept,
  };
}
for (const n of fileNodes) {
  if (!merged[n.filePath]) {
    overviewOnly.push(n.filePath);
    merged[n.filePath] = { overview: n.summary, sections: [] };
  }
}
const out = {
  version: 1,
  generatedAt: new Date().toISOString(),
  files: Object.fromEntries(Object.entries(merged).sort((a, b) => a[0].localeCompare(b[0]))),
};
fs.writeFileSync(path.join(inter, 'code-lessons.normalized.json'), JSON.stringify(out, null, 2));
console.log(JSON.stringify({ detailed: Object.keys(merged).length - overviewOnly.length, overviewOnly: overviewOnly.length, warnings }));
