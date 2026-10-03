/* Original abstract grid; no campus artwork or third-party dependencies. */
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');

function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let i = 0; i < 8; i++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const name = Buffer.from(type), length = Buffer.alloc(4), crc = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  crc.writeUInt32BE(crc32(Buffer.concat([name, data])));
  return Buffer.concat([length, name, data, crc]);
}
function generate() {
  const width = 1200, height = 1158; // 2x the 600 × 579 logical canvas.
  const pixels = Buffer.alloc(width * height * 3);
  const shapes = [];
  function rect(x, y, w, h, color) {
    shapes.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${color}"/>`);
    const rgb = color.slice(1).match(/../g).map(v => parseInt(v, 16));
    for (let py = y * 2; py < Math.min(height, (y + h) * 2); py++)
      for (let px = x * 2; px < Math.min(width, (x + w) * 2); px++)
        for (let c = 0; c < 3; c++) pixels[(py * width + px) * 3 + c] = rgb[c];
  }
  rect(0, 0, 600, 579, '#f3f7fb');
  for (let x = 0; x < 600; x += 25) rect(x, 0, 1, 579, x % 100 ? '#e6edf4' : '#d4e0ed');
  for (let y = 0; y < 579; y += 25) rect(0, y, 600, 1, y % 100 ? '#e6edf4' : '#d4e0ed');
  for (let x = 50; x < 600; x += 100) for (let y = 50; y < 579; y += 100) {
    rect(x - 3, y, 7, 1, '#bacbde');
    rect(x, y - 3, 1, 7, '#bacbde');
  }
  const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1158" viewBox="0 0 600 579"><title>Original placeholder grid — not a campus map</title>${shapes.join('')}</svg>\n`);
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width); header.writeUInt32BE(height, 4); header[8] = 8; header[9] = 2;
  const rows = Buffer.alloc((width * 3 + 1) * height);
  for (let y = 0; y < height; y++) pixels.copy(rows, y * (width * 3 + 1) + 1, y * width * 3, (y + 1) * width * 3);
  const png = Buffer.concat([Buffer.from('89504e470d0a1a0a', 'hex'), chunk('IHDR', header), chunk('IDAT', zlib.deflateSync(rows, {level: 9})), chunk('IEND', Buffer.alloc(0))]);
  return {'campus.svg': svg, 'campus.png': png};
}
function writePlaceholder(directory = path.resolve(__dirname, '../miniprogram/assets')) {
  const assets = generate();
  // Check every destination before writing either file; never clobber imported maps.
  for (const [name, bytes] of Object.entries(assets)) {
    const target = path.join(directory, name);
    if (fs.existsSync(target) && (fs.lstatSync(target).isSymbolicLink() || !fs.readFileSync(target).equals(bytes)))
      throw new Error(`Refusing to overwrite ${name}; back up and move your imported map first.`);
  }
  fs.mkdirSync(directory, {recursive: true});
  for (const [name, bytes] of Object.entries(assets)) {
    const target = path.join(directory, name);
    if (!fs.existsSync(target)) fs.writeFileSync(target, bytes, {flag: 'wx'});
  }
}
if (require.main === module) {
  writePlaceholder();
  console.log('Original placeholder SVG / PNG ready (1200 × 1158).');
}
module.exports = {generate, writePlaceholder};
