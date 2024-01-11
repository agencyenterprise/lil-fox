import Phaser from "phaser";

const createArcherAnims = (anims: Phaser.Animations.AnimationManager) => {
  anims.create({
    key: 'green_archer_shooting_right',
    frames: anims.generateFrameNames('green_archer_shooting_right', {
      start: 6, end: 9, prefix: 'tile05', suffix: '.png'
    }),
    repeat: 0,
    frameRate: 3
  })

  anims.create({
    key: 'green_archer_shooting_left',
  frames: anims.generateFrameNames('green_archer_shooting_left', {
      start: 29, end: 32, prefix: 'tile1', suffix: '.png'
    }),
    repeat: 0,
    frameRate: 3
  })
}

export {
  createArcherAnims
} 