import vec3 from 'vec3';
import Plugin from '../Plugin';
import { navigate, digEfficient } from '../utils/botactions';

export default class TreeFarm extends Plugin {
  state = {
    farming: false,
    start: null,
    radius: 1,
    ignorePositions: [],
  };

  constructor (instance) {
    super(instance);

    this.bot.on('spawn', () => {
      this.start(50);
    });
  }

  start = (radius = 10) => {
    this.setState({
      farming: true,
      start: vec3(-210, 62, 253),
      radius,
      ignorePositions: [],
    });

    this.farm();
  };

  stop = () => {
    this.setState({
      farming: false,
    });
  };

  farmable = (block) => [17, 162].includes(block.type) && !this.state.ignorePositions.find((position) => {
    return block.position.floored().x === position.floored().x &&
      block.position.floored().y === position.floored().y &&
      block.position.floored().z === position.floored().z;
  });

  /**
   * Use our own findBlock algorithm, for cutting trees, this is more efficient.
   */
  findBlock = (position, radius) => {
    position = position.floored();

    for (let x = position.x - radius; x < position.x + radius; x++) {
      for (let z = position.z - radius; z < position.z + radius; z++) {
        for (let y = position.y - 10; y < position.y + 14; y++) {
          const block = this.bot.blockAt(vec3(x, y, z));
          if (block && this.farmable(block)) {
            return block;
          }
        }
      }
    }

    return null;
  };

  /**
   * Check if the block is part of a valid tree.
   */
  isValidTree = (block) => {
    if (![17, 162].includes(block.type)) {
      return false;
    }

    for (let height = 1; height < 20; height++) {
      const validate = this.bot.blockAt(block.position.plus(vec3(0, height, 0)));

      if (validate && [18, 161].includes(validate.type)) {
        return true;
      }
    }

    return false;
  };

  farm = async () => {
    if (!this.state.farming) {
      this.log(`Farming state aborted.`);
      return;
    }

    // Find the matching blocks within reach.
    const block = this.findBlock(this.state.start, this.state.radius);

    // Check if there are any blocks blocks left
    if (!block) {
      this.stop();
      this.bot.chat(`All trees has been cut down in the given range.`);
      return;
    }

    // Check if the tree is valid, there should be leaves above it
    if (!this.isValidTree(block)) {
      this.log(`Found an invalid tree at ${block.position}: ${block.type}.`);
      this.setState({
        ignorePositions: [
          ...this.state.ignorePositions,
          vec3(block.position.x, block.position.y, block.position.z),
        ],
      });
      setImmediate(() => this.farm());
      return;
    }

    // Try navigation
    try {
      await navigate(this.bot, block.position, 5, 500);
    } catch (err) {
      this.stop();
      this.log(`Navigation error: ${err}`);
      return;
    }

    // Dig away the block
    await digEfficient(this.bot, block);

    setImmediate(() => this.farm());
  };
}