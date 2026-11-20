const fs = require('fs');
const path = require('path');
const ua = process.argv[2];
const inter = path.join(ua, 'intermediate');
const merged = JSON.parse(fs.readFileSync(path.join(inter, 'assembled-graph.json'), 'utf8'));
const scan = JSON.parse(fs.readFileSync(path.join(inter, 'scan-result.json'), 'utf8'));
const layers = JSON.parse(fs.readFileSync(path.join(inter, 'layers.json'), 'utf8'));
const tour = JSON.parse(fs.readFileSync(path.join(inter, 'tour.normalized.json'), 'utf8'));

const graph = {
  version: '1.0.0',
  project: {
    name: scan.name,
    languages: scan.languages,
    frameworks: scan.frameworks,
    description: scan.description,
    analyzedAt: new Date().toISOString(),
    gitCommitHash: process.argv[3],
  },
  nodes: merged.nodes,
  edges: merged.edges,
  layers,
  tour,
};
fs.writeFileSync(path.join(inter, 'assembled-graph.json'), JSON.stringify(graph, null, 2));
console.log(`Assembled: ${graph.nodes.length} nodes, ${graph.edges.length} edges, ${layers.length} layers, ${tour.length} tour steps`);
