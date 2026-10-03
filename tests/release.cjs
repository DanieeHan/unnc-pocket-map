'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const zlib = require('node:zlib');
const {generate, writePlaceholder} = require('../scripts/generate-placeholder.cjs');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const json = file => JSON.parse(read(file));
const config = json('project.config.json');
assert.equal(config.appid, 'touristappid');
assert.equal(config.miniprogramRoot, 'miniprogram/');
assert.ok(config.packOptions.ignore.some(p => p.type === 'folder' && p.value === 'pages/calibrate'));
assert.deepEqual(json('miniprogram/app.json').pages, ['pages/map/index']);
const calibration = json('miniprogram/data/location-calibration.json');
assert.equal(calibration.enabled, false);
for (const key of ['origin', 'matrix', 'validation']) assert.equal(calibration[key], null);
assert.deepEqual(calibration.campusBoundary, []);
assert.match(read('miniprogram/pages/map/index.wxml'), /示例底图 · 待导入/);
assert.doesNotMatch(read('miniprogram/pages/map/index.wxml'), /待导入\.16/);

function walk(directory, prefix = '') {
  return fs.readdirSync(directory, {withFileTypes: true}).flatMap(entry => {
    if (entry.name === '.git') return [];
    const name = prefix + entry.name;
    assert.ok(!entry.isSymbolicLink(), `Symlink in release: ${name}`);
    assert.doesNotMatch(name, /(?:^|\/)(?:node_modules|references|private-assets|\.DS_Store|Thumbs\.db|\.env(?:\..*)?|project\.private\.config\.json|location-(?:samples|candidate)[^/]*)(?:\/|$)|\.private\.json$|\.(?:zip|log|pdf|jpe?g|heic)$/i, `Private/unexpected file: ${name}`);
    return entry.isDirectory() ? walk(path.join(directory, entry.name), name + '/') : [name];
  });
}
const files = walk(root);
const imageFiles = files.filter(name => /\.(?:png|svg|webp|gif)$/i.test(name)).sort();
assert.deepEqual(imageFiles, ['docs/images/preview-home.png', 'miniprogram/assets/campus.png', 'miniprogram/assets/campus.svg']);
for (const file of files.filter(f => !/\.(?:png|svg)$/.test(f))) {
  const text = read(file);
  assert.doesNotMatch(text, /\bwx[0-9a-f]{16}\b/i, `Real AppID in ${file}`);
  assert.doesNotMatch(text, /(?:\/Users\/|\/home\/)[\w.-]+\//, `Local user path in ${file}`);
  assert.doesNotMatch(text, /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/, `Private key in ${file}`);
  if (!file.endsWith('.md')) continue;
  for (const match of text.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)) {
    const target = match[1].split(/\s+"/)[0].replace(/^<|>$/g, '');
    if (/^(?:[a-z]+:|#)/i.test(target)) continue;
    const resolved = path.resolve(root, path.dirname(file), decodeURIComponent(target.split('#')[0]));
    assert.ok(resolved.startsWith(root + path.sep), `Link outside release: ${file}`);
    assert.ok(fs.existsSync(resolved), `Missing link in ${file}: ${target}`);
  }
}
const assets = generate();
assert.ok(fs.readFileSync(path.join(root, 'miniprogram/assets/campus.svg')).equals(assets['campus.svg']));
// Compare decoded PNG rows to tolerate compressor differences between Node versions.
function decodePng(bytes) {
  assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  let offset = 8, header, data = [];
  while (offset < bytes.length) {
    const size = bytes.readUInt32BE(offset), type = bytes.toString('ascii', offset + 4, offset + 8);
    const body = bytes.subarray(offset + 8, offset + 8 + size);
    if (type === 'IHDR') header = body;
    if (type === 'IDAT') data.push(body);
    offset += size + 12;
  }
  return {header, rows: zlib.inflateSync(Buffer.concat(data))};
}
const actual = decodePng(fs.readFileSync(path.join(root, 'miniprogram/assets/campus.png')));
const expected = decodePng(assets['campus.png']);
assert.deepEqual(actual, expected);
const screenshot = decodePng(fs.readFileSync(path.join(root, 'docs/images/preview-home.png')));
assert.ok(screenshot.header.readUInt32BE(0) >= 320 && screenshot.header.readUInt32BE(4) >= 500);
assert.ok(screenshot.rows.length > 0);

const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'unnc-placeholder-'));
try {
  writePlaceholder(temporary);
  writePlaceholder(temporary);
  // A changed second destination must prevent creation of the first destination too.
  fs.unlinkSync(path.join(temporary, 'campus.svg'));
  const imported = Buffer.from('user-owned imported map');
  fs.writeFileSync(path.join(temporary, 'campus.png'), imported);
  assert.throws(() => writePlaceholder(temporary), /Refusing to overwrite/);
  assert.ok(!fs.existsSync(path.join(temporary, 'campus.svg')));
  assert.ok(fs.readFileSync(path.join(temporary, 'campus.png')).equals(imported));
} finally { fs.rmSync(temporary, {recursive: true, force: true}); }
for (const required of ['LICENSE', 'THIRD_PARTY_NOTICES.md', 'CONTRIBUTING.md', 'CHANGELOG.md', '.github/workflows/test.yml'])
  assert.ok(files.includes(required), `Missing release file: ${required}`);
assert.match(read('CHANGELOG.md'), new RegExp(json('package.json').version.replace(/[.]/g, '\\.')));
console.log(`PASS: ${files.length} release files; example AppID, disabled calibration, private-file scan, original assets, screenshot, local Markdown links and overwrite protection`);
