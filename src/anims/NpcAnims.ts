import Phaser from "phaser";

const createCatAnims = (anims: Phaser.Animations.AnimationManager) => {
  anims.create({
    key: 'cat_swinging_tail',
    duration: 1000,
    frames: anims.generateFrameNames('cat_swinging_tail', {
      start: 0, end: 3, prefix: 'tile00', suffix: '.png'
    }),
    repeat: -1,
    frameRate: 8
  })

  anims.create({
    key: 'cat_licking',
    duration: 1000,
    frames: anims.generateFrameNames('cat_licking', {
      start: 16, end: 18, prefix: 'tile0', suffix: '.png'
    }),
    repeat: -1,
    frameRate: 6
  })

  anims.create({
    key: 'cat_cleaning_head',
    duration: 1000,
    frames: anims.generateFrameNames('cat_cleaning_head', {
      start: 24, end: 26, prefix: 'tile0', suffix: '.png'
    }),
    repeat: -1,
    frameRate: 6
  })
}

export {
  createCatAnims
} 