import vec3 from 'vec3';
import Plugin from '../plugin';
import { navigate } from '../botutils';

export default class Stripmine extends Plugin {
  state = {
    mining: false,
    step: 0,
    landmarks: {
      start: null,
      toolChest: null,
      depositChest: null,
    },
  };

  constructor (instance) {
    super(instance);

    this.bot.on('spawn', () => {
      // this.setup();
    });

    // this.bot.on('blockBreakProgressObserved', (e) => console.log(e));
  }

  setup = () => {
    this.bot.chat(`Place a redstone torch to mark the start location.`);

    this.setState({
      mining: true,
      step: 0,
      landmarks: {
        start: null,
        toolChest: null,
        depositChest: null,
      },
    });
  };

  stripminePosition = (step, position, branchDepth) => {

  };

  updateInventory = async () => {
    // Put all the items away, excecpt from the mining tools.

    // 

    await navigate(this.bot, this.state.landmarks.start, 0);

    this.bot.chat('Ready!');
  };

  mine = () => {

  };

  /**
   * Handle commands
   */
  onCommand = (username, command, args) => {
    if (command !== 'stripmine' && command !== 'strip') {
      return;
    }
  };

  /**
   * Handle block updates
   */
  onBlockUpdate = (oldBlock, newBlock) => {
    if (this.state.mining === false) {
      return false;
    }

    if (this.state.landmarks.start === null) {
      // Set the starting position for mining
      if (newBlock.name === 'redstone_torch') {
        this.setState({
          landmarks: {
            ...this.state.landmarks,
            start: newBlock.position,
          },
        });

        this.bot.chat(`Place a chest for the tools now.`);
      }
    } else if (this.state.landmarks.toolChest === null) {
      // Set the starting position for mining
      if (newBlock.name === 'chest') {
        this.setState({
          landmarks: {
            ...this.state.landmarks,
            toolChest: newBlock.position,
          },
        });

        this.bot.chat(`Place a deposit chest now.`);
      }
    } else if (this.state.landmarks.depositChest === null) {
      // Set the starting position for mining
      if (newBlock.name === 'chest') {
        this.setState({
          landmarks: {
            ...this.state.landmarks,
            depositChest: newBlock.position,
          },
        });

        this.bot.chat(`Starting stripmining!`);

        this.updateInventory();
      }
    }
  };

  // constructor (instance) {
  //   super(instance);

  //   this.bot.on('spawn', () => {
  //     // this.mine(this.bot.entity.position, vec3(0, 0, 1));
  //     // this.mine(vec3(140, 67, 267), vec3(0, 0, 1));
  //   });
  // }

  // breakBlock = (block) => {
  //   return new Promise((resolve, reject) => {
  //     // @TODO: Equip the right tool

  //     this.bot.dig(block, (err) => {
  //       if (err) {
  //         return reject(err);
  //       }

  //       return resolve();
  //     });
  //   });
  // };

  // mine = (position, direction) => {
  //   const target = position.floor().plus(direction);

  //   const lower = this.bot.blockAt(target);
  //   const upper = this.bot.blockAt(target.offset(0, 1, 0));

  //   if (lower && lower.boundingBox !== 'empty') {
  //     this.breakBlock(lower).then(() => {
  //       setTimeout(() => this.mine(position, direction), 500);
  //     });
  //     return;
  //   }

  //   if (upper && upper.boundingBox !== 'empty') {
  //     this.breakBlock(upper).then(() => {
  //       setTimeout(() => this.mine(position, direction), 500);
  //     });
  //     return;
  //   }

  //   this.bot.navigate.walk([target.offset(0.5, 0, 0.5)], (err) => {
  //     if (err) {
  //       console.error('err>', err);
  //       // return;
  //     }

  //     setTimeout(() => {
  //       this.mine(this.bot.entity.position, vec3(0, 0, 1));
  //     }, 250);
  //   });
  // };

  

  // breakBlock = (block) => {
  //   return new Promise((resolve, reject) => {
  //     // @TODO: Equip the right tool

  //     this.bot.dig(block, (err) => {
  //       if (err) {
  //         return reject(err);
  //       }

  //       return resolve();
  //     });
  //   });
  // };

  // mine = (position, direction) => {
  //   const target = position.floor().plus(direction);

  //   const lower = this.bot.blockAt(target);
  //   const upper = this.bot.blockAt(target.offset(0, 1, 0));

  //   if (lower && lower.boundingBox !== 'empty') {
      
  //   }

  //   // const target = position.floor().plus(direction);

  //   // console.log(target, position);

  //   // const lower = this.bot.blockAt(target);
  //   // const upper = this.bot.blockAt(target.offset(0, 1, 0));

  //   // if (lower && lower.boundingBox !== 'empty') {
  //   //   this.mine(lower).then(() => {
  //   //     console.log('Mined!');
  //   //   }).catch((err) => {
        
  //   //   });
  //   //   return;
  //   // }


  //   // this.bot.dig(this.bot.blockAt(position.plus(vec3(1, 0, 0))), () => {
  //   //   this.bot.dig(this.bot.blockAt(position.plus(vec3(1, 1, 0))), () => {
  //   //     const path = this.bot.navigate.findPathSync(position.plus(vec3(1, 0, 0)), {
  //   //       endRadius: 0,
  //   //       timeout: 1000,
  //   //     });

  //   //     this.bot.navigate.walk(path.path, () => {
  //   //       this.stripmine(position.plus(vec3(1, 0, 0)));
  //   //     });
  //   //   });
  //   // });
  // };

  // onCommand = (username, command, args) => {
  //   if (command !== 's') {
  //     return;
  //   }

  //   this.mine(vec3(140, 67, 268), vec3(0, 0, 1));

  //   // this.dig(vec3(74, 62, 376), 0);

  //   // const block = this.bot.blockAt(this.bot.entity.position.plus(vec3(0, -1, 0)));

  //   // this.bot.dig(block, (err) => {
  //   //   if (err) {
  //   //     console.error('DIG ERR', err);
  //   //     return;
  //   //   }

  //   //   console.log('DIG DONE');
  //   // });
  // };
};
// this.bot.entity.position