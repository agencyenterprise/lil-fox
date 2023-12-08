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
    scene.physics.add.existing(this, false);

  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    if (!cursors) return;

    const speed = 100

    if (cursors.left?.isDown) {
      this.anims.play("run-default", true);
      this.setVelocity(-speed, 0);
      this.scaleX = -1;
      this.body?.offset.setTo(24, 8);

    } else if (cursors.right?.isDown) {
      this.anims.play("run-default", true);
      this.setVelocity(speed, 0);
      this.scaleX = 1;
      this.body?.offset.setTo(8, 8);

    } else if (cursors.up?.isDown) {
      this.anims.play("run-default");
      this.setVelocity(0, -speed);

    } else if (cursors.down?.isDown) {
      this.anims.play("run-default");
      this.setVelocity(0, speed);

    } else {
      this.anims.play("idle-default");
      this.setVelocity(0, 0);
    }
  }
}