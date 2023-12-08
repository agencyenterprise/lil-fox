import Phaser from "phaser";

declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      character(
        x: number,
        y: number,
        texture: string,
        frame?: string | number
      ): Character;
    }
  }
}

export default class Character extends Phaser.Physics.Arcade.Sprite {

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame)

    this.anims.play("idle-default");
  }
}

// Phaser.GameObjects.GameObjectFactory.register("character", function (
//   this: Phaser.GameObjects.GameObjectFactory,
//   x: number,
//   y: number,
//   texture: string,
//   frame?: string | number
// ) {
//   var sprite = new Character(this.scene, x, y, texture, frame);

//   this.displayList.add(sprite);
//   this.updateList.add(sprite);

//   this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY);

//   sprite.body?.setSize(sprite.width * 0.5, sprite.height * 0.5);

//   return sprite;
// }) 