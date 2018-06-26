import Plugin from '../Plugin';
import { tunnel, excavate, strip } from '../utils/miningAlgorithms';
import { navigate, digEfficient } from '../utils/botactions';
import vec3 from 'vec3';

export default class Mine extends Plugin {
  state = {
    mining: false,
    start: null,
    algorithm: '',
    step: 0,
    chest: {
      tools: null,
      deposit: null,
    },
  };

  start = (algorithm) => {
    this.setState({
      mining: true,
      start: null,
      step: 0,
      algorithm,
      toolChest: null,
      depositChest: null,
    });

    this.bot.chat(`Place the chest with mining tools.`);
  };

  stop = () => {
    this.setState({
      mining: false,
    });
  };

  mine = async () => {
    this.log(`Mining step ${this.state.step}`);

    if (!this.state.mining) {
      this.log(`Mining state aborted.`);
      return;
    }

    // Get the mining offset based on the given algorithm
    let offset = null;
    switch (this.state.algorithm) {
      case 'tunnel':
        offset = tunnel(this.state.step, 4, 4);
        break;

      case 'excavate':
        offset = excavate(this.state.step, 4, 4);
        break;

      case 'strip':
        offset = strip(this.state.start, 10, 2);
        break;
    }

    // Check if we have an offset
    if (!offset) {
      this.stop();
      this.log(`Invalid offset for algorithm ${this.state.algorithm}.`);
      return;
    }

    // Calculate the target position of the world
    const target = offset.plus(this.state.start).floored();

    // Find the targeted block
    const block = this.bot.blockAt(target);

    // If we dont have a block, the block might be outside of the render
    // distance. Or something else is going terribly wrong..
    if (!block) {
      this.stop();
      this.log(`No block found at ${target}.`);
      return;
    }

    // Check if the block is diggable, if not, it probably has already been
    // digged so we can continue to the next mining step.
    if (block.boundingBox !== 'block') {
      this.setState({
        step: this.state.step + 1,
      });
      setImmediate(() => this.mine());
      return;
    }

    // @TODO: Check if the player inventory still contains tools, if not
    // return to the tool chest and get some tools.

    // @TODO: Check if the player inventory is 100% full, then return
    // to the deposit chest and deposit all the items.

    // @TODO: See if we can secure the mining area, by filling some dangerous
    // holes or blocks, such as falls, lava and water.

    // Navigates close to the target position
    try {
      await navigate(this.bot, target, 5);
    } catch (err) {
      this.stop();
      this.log(`Navigation error: ${err}`);
      return;
    }

    // Dig away the block
    await digEfficient(this.bot, block);

    // Restart loop
    setImmediate(() => this.mine());
  };

  onCommand = (username, command, args) => {
    if (command !== 'mine') {
      return;
    }

    this.start('tunnel');
  };

  /**
   * 
   */
  onBlockUpdate = (oldBlock, newBlock) => {
    if (this.state.mining === false) {
      return;
    }

    // Check for placements of the tools chest
    if (this.state.toolChest === null) {
      if (newBlock.name === 'chest') {
        this.setState({
          toolChest: newBlock.position,
        });
        this.bot.chat(`Place the chest where i can deposit.`);
      }
    } 
    
    // Check for placements of the deposit chest
    else if (this.state.depositChest === null) {
      if (newBlock.name === 'chest') {
        this.setState({
          depositChest: newBlock.position,
        });

        this.bot.chat(`Place a redstone torch where i can start digging.`);
      }
    }

    // Check for placements of the start position (redstone torch)
    else if (this.state.start === null) {
      if (newBlock.name === 'redstone_torch') {
        this.setState({
          start: newBlock.position,
        });

        this.bot.chat(`Starting the mining..`);

        this.mine();
      }
    }
  };
};
