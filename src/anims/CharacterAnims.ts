import Phaser from "phaser";

const createCharacterAnims = (anims: Phaser.Animations.AnimationManager) => {
  anims.create({
    key: "idle-default",
    frames: anims.generateFrameNumbers("idle-default"),
    frameRate: 8,
  });
  anims.create({
    key: "crouch-default",
    frames: anims.generateFrameNumbers("crouch-default"),
    frameRate: 8,
  });
  anims.create({
    key: "sit-default",
    frames: anims.generateFrameNumbers("sit-default"),
    frameRate: 8,
  });
  anims.create({
    key: "sneak-default",
    frames: anims.generateFrameNumbers("sneak-default"),
    frameRate: 8,
  });
  anims.create({
    key: "walk-default",
    frames: anims.generateFrameNumbers("walk-default"),
    frameRate: 8,
  });
  anims.create({
    key: "run-default",
    frames: anims.generateFrameNumbers("run-default"),
    frameRate: 8,
    repeat: -1,
  });
  anims.create({
    key: "hurt-default",
    frames: anims.generateFrameNumbers("hurt-default"),
    frameRate: 8,
  });
  anims.create({
    key: "die-default",
    frames: anims.generateFrameNumbers("die-default"),
    frameRate: 8,
  });
}

export {
  createCharacterAnims
} 