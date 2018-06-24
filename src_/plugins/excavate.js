import vec3 from 'vec3';
import Plugin from '../plugin';
import { efficientDig, navigate } from '../botutils';

export default class Excavate extends Plugin {
  state = {
    excavating: false,
    landmark: {
      start: null,
      end: null,
      toolChest: null,
      depositChest: null,
    },
  };

  excavateVec3 = (step, width, length) => {
    const x = step % width;
    const y = ~Math.ceil(step / (width * length));
    const z = Math.floor(step / length);
    return vec3(x, y, z);
  };

  start = () => {
    this.bot.chat(`Place a chest where i can take the tools from first.`);

    this.setState({
      excavating: true,
      landmark: {
        start: null,
        end: null,
        toolChest: null,
        depositChest: null,
      },
    });
  };

  stop = () => {
    this.setState({
      excavating: false,
    });
  };

  excavate = async (step) => {
    if (!this.state.excavating) {
      return;
    }

    const targetPosition = this.excavateVec3(
      step,
      Math.abs(this.state.landmark.start.x - this.state.landmark.end.x),
      Math.abs(this.state.landmark.start.z - this.state.landmark.end.z)
    ).plus(vec3(
      Math.min(this.state.landmark.start.x, this.state.landmark.end.x),
      Math.max(this.state.landmark.start.y, this.state.landmark.end.y),
      Math.min(this.state.landmark.start.z, this.state.landmark.end.z),
    ));

    console.log(targetPosition);

    const targetBlock = this.bot.blockAt(targetPosition);

    if (targetBlock.boundingBox !== 'block') {
      setImmediate(() => this.excavate(step + 1));
      return;
    }

    await navigate(this.bot, targetPosition.plus(vec3(0, 1, 0)), 1);
    await efficientDig(this.bot, targetBlock);

    // @TODO: Plug dangerous blocks, such as water and lava
    // @TODO: Check the inventory, if it is full, return to the deposit chest and put everything away
    // @TODO: Make sure, there are tools and soem basic building blocks in the inventory

    setImmediate(() => this.excavate(step + 1));
  };

  /**
   * Handle commands
   */
  onCommand = (username, command, args) => {
    if (command !== 'excavate' && command !== 'exc') {
      return;
    }

    if (args.length === 0) {
      this.start();
    } else if (args.length === 1 && args[0] === 'stop') {
      this.stop();
    }
  };

  /**
   * Handle block updates
   */
  onBlockUpdate = (oldBlock, newBlock) => {
    if (this.state.excavating === false || (
      this.state.landmark.start !== null &&
      this.state.landmark.end !== null &&
      this.state.landmark.toolChest !== null &&
      this.state.landmark.depositChest !== null
    )) {
      return;
    }

    // Check for the toolchest placement first
    if (this.state.landmark.toolChest === null) {
      if (newBlock.name === 'chest') {
        this.setState({
          landmark: {
            ...this.state.landmark,
            toolChest: newBlock.position,
          },
        });
  
        this.bot.chat(`Now place a chest where i can deposit the mined items.`);
      }
    }

    // Check for the depositchest second
    else if (this.state.landmark.depositChest === null) {
      if (newBlock.name === 'chest') {
        this.setState({
          landmark: {
            ...this.state.landmark,
            depositChest: newBlock.position,
          },
        });
  
        this.bot.chat(`Now mark the area with the first redstone torch.`);
      }
    }

    // Check for the start landmark
    else if (this.state.landmark.start === null) {
      if (newBlock.name === 'redstone_torch') {
        this.setState({
          landmark: {
            ...this.state.landmark,
            start: newBlock.position,
          },
        });
  
        this.bot.chat(`Now mark the area with the last redstone torch.`);
      }
    }

    // Check for the end landmark
    else if (typeof this.state.landmark.end !== 'Vec3') {
      if (newBlock.name === 'redstone_torch') {
        this.setState({
          landmark: {
            ...this.state.landmark,
            end: newBlock.position,
          },
        });
  
        this.bot.chat(`Starting the excavation.`);
  
        this.excavate(0);
      }
    }
  };
}
