// A and B represents landmarks (placed redstone torches).
const a = {x:  0, y: 10, z:  0};
const b = {x: 10, y: 10, z: 10};

const maxx = Math.max(a.x, b.x);
const minx = Math.min(a.x, b.x);
const maxy = Math.max(a.y, b.y);
const miny = Math.min(a.y, b.y);
const maxz = Math.max(a.z, b.z);
const minz = Math.min(a.z, b.z);
const square = Math.abs(maxx - minx) * Math.abs(maxz - minz);

// Target block
const step = 101; // Removed block count

const x = step % maxx; // @TODO: Flip every row for performance?
const y = maxy - Math.ceil(step / square);
const z = Math.floor(step / maxz);

console.log('Target at step %d:', step, x, y, z);
