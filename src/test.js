import { tunnel, excavate, strip } from './miningpaths';
import vec3 from 'vec3';

for (let i = 0; i < 20; i++) {
  console.log(strip(i, 10, 2));
}






// import vec3 from 'vec3';

// const a = 100;
// const b = 80;

// console.log(a - b, b - a, Math.abs(a - b), Math.abs(b - a));

// // const excavateVec3 = (step, width, length) => {
// //   const x = step % width;
// //   const y = ~Math.ceil(step / (width * length));
// //   const z = Math.floor(step / length);
// //   return vec3(x, y, z);
// // };

// // for (let i = 0; i < 20; i++) {
// //   console.log(excavateVec3(i, 3, 3));
// // }

// // const x = step % maxx; // @TODO: Flip every row for performance?
// // const y = maxy - Math.ceil(step / square);
// // const z = Math.floor(step / maxz);

// // const stripminePosition = (step, branchDepth) => {

// //   return vec3(
// //     0,
// //     step % 2,
// //     0
// //   );
// // };

// // for (let i = 0; i < 10; i++) {
// //   console.log(stripminePosition(i, 4));
// // }

// // stripminePosition = (step, position, branchDepth) => {
    
// // };

// // A and B represents landmarks (placed redstone torches).
// // const a = {x:  0, y: 10, z:  0};
// // const b = {x: 10, y: 10, z: 10};

// // const maxx = Math.max(a.x, b.x);
// // const minx = Math.min(a.x, b.x);
// // const maxy = Math.max(a.y, b.y);
// // const miny = Math.min(a.y, b.y);
// // const maxz = Math.max(a.z, b.z);
// // const minz = Math.min(a.z, b.z);
// // const square = Math.abs(maxx - minx) * Math.abs(maxz - minz);

// // // Target block
// // const step = 101; // Removed block count

// // const x = step % maxx; // @TODO: Flip every row for performance?
// // const y = maxy - Math.ceil(step / square);
// // const z = Math.floor(step / maxz);

// // console.log('Target at step %d:', step, x, y, z);
