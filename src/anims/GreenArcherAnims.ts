import Phaser from "phaser";

const createArcherAnims = (anims: Phaser.Animations.AnimationManager) => {
  anims.create({
    key: 'green_archer_shooting',
    frames: anims.generateFrameNames('green_archer_shooting', {
      start: 8, end: 10, prefix: 'tile00', suffix: '.png'
    }),
    repeat: 0,
    frameRate: 3
  })
}

export {
  createArcherAnims
} 