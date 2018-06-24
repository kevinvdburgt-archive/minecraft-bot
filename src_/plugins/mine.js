import Plugin from '../plugin';
import { navigate } from '../botutils';

export default class Mine extends Plugin {
  state = {
    mining: false,
    toolChest: null,
    depositChest: null,
    landmarks: [],
  };

  constructor(instance) {
    super(instance);

    this.bot.on('spawn', () => {
      const block = this.bot.findBlock({
        matching: [54, 130, 146],
      });

      console.log(block.position);
    });
  }

  updateInventory = async () => {


    await navigate(this.bot, this.state.depositChest);

    await navigate(this.bot, this.state.toolChest);
  };
};
