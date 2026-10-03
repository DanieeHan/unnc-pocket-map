// Regression: Node accepts require('file.json'); WeChat tries file.json.js.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '../miniprogram');
let page;
const cache = new Map();
const wx = {
  getWindowInfo: () => ({windowWidth: 390, windowHeight: 844, statusBarHeight: 44}),
  getStorageSync: () => [], showShareMenu() {}, showToast() {},
  getLocation() { throw new Error('Disabled calibration must not request location'); }
};
function load(file) {
  if (!file.endsWith('.js')) file += '.js';
  assert.ok(file.startsWith(root + path.sep), 'Module outside miniprogram');
  assert.ok(fs.existsSync(file), `Missing WeChat JavaScript module: ${path.relative(root, file)}`);
  if (cache.has(file)) return cache.get(file).exports;
  const module = {exports: {}};
  cache.set(file, module);
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), {
    module, exports: module.exports, wx, Page: p => { page = p; },
    require: id => { assert.ok(id.startsWith('.'), 'Only local modules supported'); return load(path.resolve(path.dirname(file), id)); }
  }, {filename: file});
  return module.exports;
}
load(path.join(root, 'pages/map/index.js'));
assert.ok(page, 'Map page must register');
page.setData = function(patch, callback) { Object.assign(this.data, patch); if (callback) callback(); };
page.onLoad({});
assert.equal(page.data.results.length, 66);
page.locateMe();
assert.equal(page.data.locationMessage, '定位待校准');
assert.equal(page.data.userLocation, null);
load(path.join(root, 'pages/calibrate/index.js'));
const source = JSON.parse(fs.readFileSync(path.join(root, 'data/location-calibration.json'), 'utf8'));
const runtime = load(path.join(root, 'data/location-calibration.js'));
assert.deepEqual(JSON.parse(JSON.stringify(runtime)), source, 'Run node scripts/sync-calibration.cjs after changing calibration JSON');
console.log('PASS: WeChat JS-only module loading, page registration/startup, disabled location and calibration source consistency');
