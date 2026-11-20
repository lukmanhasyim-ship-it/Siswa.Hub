const fs = require('fs');
const path = require('path');
const ua = process.argv[2];
const projectRoot = process.argv[3];
const commit = process.argv[4];
const scan = JSON.parse(fs.readFileSync(path.join(ua, 'intermediate', 'scan-result.json'), 'utf8'));
const input = {
  projectRoot,
  filePaths: scan.files.map(f => f.path),
  gitCommitHash: commit,
};
fs.writeFileSync(path.join(ua, 'intermediate', 'fingerprint-input.json'), JSON.stringify(input, null, 2));
console.log(`Fingerprint input: ${input.filePaths.length} files @ ${commit}`);
