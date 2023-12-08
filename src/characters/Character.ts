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

enum HealthState {
  IDLE,
  DAMAGE,
}

export default class Character extends Phaser.Physics.Arcade.Sprite {

  private healthState = HealthState.IDLE
  private damageTime = 0 

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame)

    this.anims.play("idle-default");
    scene.physics.add.existing(this, false);

  }

  protected preUpdate(time: number, delta: number): void {
    switch (this.healthState) {
      case HealthState.IDLE:
        break;

      case HealthState.DAMAGE:
        this.damageTime += delta
        if (this.damageTime >= 250) {
          this.healthState = HealthState.IDLE
          this.setTint(0xffffff)
          this.damageTime = 0
        }
        break;
    }
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

  handleDamage(dir: Phaser.Math.Vector2) {
    if (this.healthState === HealthState.DAMAGE) return  
    this.setVelocity(dir.x, dir.y) 
    this.setTint(0xff0000)
    this.healthState = HealthState.DAMAGE  
    this.damageTime = 0
  }
 }