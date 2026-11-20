const fs = require('fs');
const path = require('path');
const ua = process.argv[2];
const graph = JSON.parse(fs.readFileSync(path.join(ua, 'intermediate', 'assembled-graph.json'), 'utf8'));
const raw = JSON.parse(fs.readFileSync(path.join(ua, 'intermediate', 'layers.json'), 'utf8'));
let layers = Array.isArray(raw) ? raw : raw.layers;
layers = layers.map(layer => {
  const nodeIds = layer.nodeIds || layer.nodes || [];
  return {
    id: layer.id || `layer:${String(layer.name || 'layer').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    name: layer.name || layer.id,
    description: layer.description || '',
    nodeIds: nodeIds.map(id => (typeof id === 'string' ? id : id.id)),
  };
});
const ids = new Set(graph.nodes.map(n => n.id));
const fileTypes = new Set(['file', 'config', 'document', 'service', 'pipeline', 'table', 'schema', 'resource', 'endpoint']);
const fileNodes = graph.nodes.filter(n => fileTypes.has(n.type)).map(n => n.id);
const assigned = new Map();
const dangling = [];
for (const layer of layers) {
  for (const id of layer.nodeIds) {
    if (!ids.has(id)) dangling.push(id);
    if (assigned.has(id)) dangling.push(`DUPLICATE:${id}`);
    assigned.set(id, layer.id);
  }
}
const unassigned = fileNodes.filter(id => !assigned.has(id));
fs.writeFileSync(path.join(ua, 'intermediate', 'layers.json'), JSON.stringify(layers, null, 2));
console.log(JSON.stringify({ layers: layers.length, dangling, unassigned, totalFileNodes: fileNodes.length }));
