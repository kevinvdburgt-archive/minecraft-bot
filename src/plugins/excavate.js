import vec3 from 'vec3';
import Plugin from '../plugin';
import { efficientDig } from '../botutils';

export default class Excavate extends Plugin {
  state = {
    excavating: false,
    landmarks: [],
  };

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
    if (!this.state.excavating) {
      return;
    }

    const position = this.excavatePostion(step);
    const block = this.bot.blockAt(position);

    // If the block is not diggable, ignore it and continue to the next step
    if (block.boundingBox !== 'block') {
      this.excavate(step + 1);
      return;
    }

    // Navigate to the block, so we are in range for digging it
    const path = this.bot.navigate.findPathSync(position.plus(vec3(0, 1, 0)), {
      timeout: 2500,
      endRadius: 1,
    });

    this.bot.navigate.walk(path.path, (status) => {
      efficientDig(this.bot, block)
        .then(() => {
          this.excavate(step + 1);
        })
        .catch((err) => {
          console.log(err);
          this.excavate(step + 1);
        });
    });
  };

  onCommand = (username, command, args) => {
    if (command !== 'excavate') {
      return;
    }

    // Start the excavation
    if (args.length === 0) {
      if (this.state.excavating) {
        this.bot.chat(`Already busy with excavating.`);
        return;
      }

      if (!this.bot.players[username].entity) {
        this.bot.chat(`You are to far away from me.`);
        return;
      }

      this.bot.chat(`Places 2 redstone torches for the landmarks.`);

      this.setState({
        excavating: true,
        landmarks: [],
      });
    }

    else if (args.length === 1 && args[0] === 'stop') {
      if (!this.state.excavating) {
        this.bot.chat(`I'm not excavating...`);
        return;
      }

      this.bot.chat(`Okay, stopping the excavating!`);

      this.setState({
        excavating: false,
        landmarks: [],
      });
    }
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
