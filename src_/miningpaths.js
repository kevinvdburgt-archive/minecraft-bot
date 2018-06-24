import vec3 from 'vec3';

export const tunnel = (step, width, height) => {
  const x = step % width;
  const y = Math.floor(step / height) % height;
  const z = Math.ceil((step + 1) / (width * height));
  return vec3(x, y, z);
};

export const excavate = (step, width, length) => {
  // @TODO: Make a stairway on the outside sides
  // see: https://i.imgur.com/Csu0FeY.png
  const x = step % width;
  const y = ~Math.ceil((step + 1) / (width * length)) + 1;
  const z = Math.floor(step / length) % length;
  return vec3(x, y, z);
};

export const strip = (step, brancheDepth, height = 2) => {
  // @TODO: Figure this out..
  // see: https://i.imgur.com/xA1rC5M.png

  // Work from top to bottom instead of bottom to top
  const y = height - (step % height) - 1;

  return vec3(0, y, 0);
};
