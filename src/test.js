const state = {
  points: [
    {x: 0, y: 0, z: 0},
    {x: 9, y: 9, z: 9},
  ],
};

const excavate = (step) => {
  const minx = Math.min(state.points[0].x, state.points[1].x);
  const minz = Math.min(state.points[0].z, state.points[1].z);
  const maxx = Math.max(state.points[0].x, state.points[1].x);
  const maxz = Math.max(state.points[0].z, state.points[1].z);
  const maxy = Math.max(state.points[0].y, state.points[1].y);
  const surf = Math.abs(maxx - minx + 1) * Math.abs(maxz - minz + 1);

  console.log(`Surface size: ${surf} m2`);

  console.log('m2:', (Math.abs(maxx - minx + 1) * Math.abs(maxz - minz + 1)));

  const y = (Math.abs(maxx - minx + 1) * Math.abs(maxz - minz + 1)) % step;

  console.log(y);
};

excavate(11);

console.log(102 % 100);

// const minX = Math.min(this.state.points[0].x, this.state.points[1].x);
//     const maxX = Math.max(this.state.points[0].x, this.state.points[1].x);
//     const minZ = Math.min(this.state.points[0].z, this.state.points[1].z);
//     const maxZ = Math.max(this.state.points[0].z, this.state.points[1].z);
    
//     const maxY = Math.max(this.state.points[0].y, this.state.points[1].y);

//     const level = step % Math.abs(maxX - minX + 1) * Math.abs(maxZ - minZ + 1);