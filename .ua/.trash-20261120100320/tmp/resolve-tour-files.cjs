const fs = require('fs');
const path = require('path');
const ua = process.argv[2];
const graph = JSON.parse(fs.readFileSync(path.join(ua, 'intermediate', 'assembled-graph.json'), 'utf8'));
const tour = JSON.parse(fs.readFileSync(path.join(ua, 'intermediate', 'tour.normalized.json'), 'utf8'));
const byId = new Map(graph.nodes.map(n => [n.id, n]));
const covered = new Map();
for (const step of tour) {
  for (const id of step.nodeIds || []) {
    const node = byId.get(id);
    if (!node || !node.filePath) continue;
    const prev = covered.get(node.filePath);
    if (prev === undefined || step.order < prev) covered.set(node.filePath, step.order);
  }
}
const files = [...covered.entries()]
  .map(([filePath, tourOrder]) => ({ filePath, tourOrder }))
  .sort((a, b) => a.tourOrder - b.tourOrder || a.filePath.localeCompare(b.filePath));
fs.writeFileSync(path.join(ua, 'intermediate', 'tour-files.json'), JSON.stringify(files, null, 2));
console.log(`Covered files: ${files.length}`);
for (const f of files) console.log(`  ${f.tourOrder} ${f.filePath}`);
