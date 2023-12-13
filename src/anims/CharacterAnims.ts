import Phaser from "phaser";
import { Skin } from "@/characters/Character";

const createCharacterAnims = (anims: Phaser.Animations.AnimationManager) => {
  createSkinAnimation(anims, Skin.DEFAULT)
  createSkinAnimation(anims, Skin.BLUE)
  createSkinAnimation(anims, Skin.KUMAMON)
  createSkinAnimation(anims, Skin.SUNGLASSES)
}

const createSkinAnimation = (anims: Phaser.Animations.AnimationManager, skinName: string) => {
  anims.create({
    key: `idle-${skinName}`,
    frames: anims.generateFrameNumbers(`idle-${skinName}`),
    frameRate: 8,
  });
  anims.create({
    key: `crouch-${skinName}`,
    frames: anims.generateFrameNumbers(`crouch-${skinName}`),
    frameRate: 8,
  });
  anims.create({
    key: `sit-${skinName}`,
    frames: anims.generateFrameNumbers(`sit-${skinName}`),
    frameRate: 8,
  });
  anims.create({
    key: `sneak-${skinName}`,
    frames: anims.generateFrameNumbers(`sneak-${skinName}`),
    frameRate: 8,
  });
  anims.create({
    key: `walk-${skinName}`,
    frames: anims.generateFrameNumbers(`walk-${skinName}`),
    frameRate: 8,
  });
  anims.create({
    key: `run-${skinName}`,
    frames: anims.generateFrameNumbers(`run-${skinName}`),
    frameRate: 8,
    repeat: -1,
  });
  anims.create({
    key: `hurt-${skinName}`,
    frames: anims.generateFrameNumbers(`hurt-${skinName}`),
    frameRate: 8,
  });
  anims.create({
    key: `die-${skinName}`,
    frames: anims.generateFrameNumbers(`die-${skinName}`),
    frameRate: 8,
  });
}

export {
  createCharacterAnims
} 