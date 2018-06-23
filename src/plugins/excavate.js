import Plugin from '../plugin';

export default class Excavate extends Plugin {
  state = {
    excavating: false,
    points: [],
    steps: 0,
  };

  excavate = (step) => {
    const minX = Math.min(this.state.points[0].x, this.state.points[1].x);
    const maxX = Math.max(this.state.points[0].x, this.state.points[1].x);
    const minZ = Math.min(this.state.points[0].z, this.state.points[1].z);
    const maxZ = Math.max(this.state.points[0].z, this.state.points[1].z);
    
    const maxY = Math.max(this.state.points[0].y, this.state.points[1].y);

    const level = step % Math.abs(maxX - minX + 1) * Math.abs(maxZ - minZ + 1);
  };

  onCommand = (username, command, args) => {
    if (command !== 'excavate') {
      return;
    }

    if (args.length === 0) {
      this.setState({
        excavating: true,
        points: [],
      });

      this.bot.chat(`Place 2 redstone torches to mark the excavating area.`);
    }
  };

  onBlockUpdate = (oldBlock, newBlock) => {
    if (this.state.excavating === false || this.state.points.length === 2) {
      return;
    }

    if (newBlock.name === 'redstone_torch') {
      this.setState({
        points: [
          ...this.state.points,
          newBlock.position,
        ],
      });

      if (this.state.points.length === 1) {
        this.bot.chat(`First torch found, place the 2nd torch to start excavating.`);
        return;
      }

      const minX = Math.min(this.state.points[0].x, this.state.points[1].x);
      const maxX = Math.max(this.state.points[0].x, this.state.points[1].x);
      const minZ = Math.min(this.state.points[0].z, this.state.points[1].z);
      const maxZ = Math.max(this.state.points[0].z, this.state.points[1].z);
      const m2 = Math.abs(maxX - minX + 1) * Math.abs(maxZ - minZ + 1);

      this.bot.chat(`Starting to excate an area of ${m2}m2`);
    }
  };
};
