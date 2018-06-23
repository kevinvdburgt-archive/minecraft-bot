import vec3 from 'vec3';
import Plugin from '../plugin';

export default class Excavate extends Plugin {
  state = {
    excavating: false,
    landmarks: [],
  };

  constructor(instance) {
    super(instance);

    this.bot.on('spawn', () => {
      this.setState({
        excavating: true,
      });
    });
  }

  excavatePostion = (step) => {
    const maxx = Math.max(this.state.landmarks[0].x, this.state.landmarks[1].x);
    const minx = Math.min(this.state.landmarks[0].x, this.state.landmarks[1].x);
    const maxy = Math.max(this.state.landmarks[0].y, this.state.landmarks[1].y);
    const miny = Math.min(this.state.landmarks[0].y, this.state.landmarks[1].y);
    const maxz = Math.max(this.state.landmarks[0].z, this.state.landmarks[1].z);
    const minz = Math.min(this.state.landmarks[0].z, this.state.landmarks[1].z);

    const localx = Math.abs(maxx - minx + 1);
    const localz = Math.abs(maxz - minz + 1);

    const square = localx * localz;

    return vec3(
      (step % localx) + minx, // @TODO: Flip every row for performance?
      maxy - Math.floor(step / square) - 1,
      (Math.floor(step / localz) % localz) + minz,
    );
  };

  excavate = (step) => {
    const position = this.excavatePostion(step);

    const block = this.bot.blockAt(position);

    if (block.boundingBox !== 'block') {
      this.excavate(step + 1);
      return;
    }

    const path = this.bot.navigate.findPathSync(position.plus(vec3(0, 1, 0)), {
      timeout: 2500,
      endRadius: 1,
    });

    this.bot.navigate.walk(path.path, (status) => {
      if (status === 'arrived') {
        this.bot.dig(block, () => {
          this.excavate(step + 1);
        });
      }
    });
  };

  onBlockUpdate = (oldBlock, newBlock) => {
    if (this.state.excavating !== true || this.state.landmarks.length === 2) {
      return;
    }

    if (newBlock.name === 'redstone_torch') {
      this.setState({
        landmarks: [
          ...this.state.landmarks,
          newBlock.position,
        ],
      });
    }

    if (this.state.landmarks.length === 2) {
      const minx = Math.min(this.state.landmarks[0].x, this.state.landmarks[1].x);
      const maxx = Math.max(this.state.landmarks[0].x, this.state.landmarks[1].x);
      const minz = Math.min(this.state.landmarks[0].z, this.state.landmarks[1].z);
      const maxz = Math.max(this.state.landmarks[0].z, this.state.landmarks[1].z);
      const square = Math.abs(maxx - minx + 1) * Math.abs(maxz - minz + 1);

      this.bot.chat(`Starting excavating the area of ${square}m2.`);

      this.excavate(0);
    }
  };
}
