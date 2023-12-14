import Chest from "@/items/Chest";
import Phaser from "phaser";
import { sceneEvents } from "@/events/EventsCenter";

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

export enum Skin {
  DEFAULT = "default",
  BLUE = "blue",
  FLASK = "flask",
  KUMAMON = "kumamon",
  SUNGLASSES = "sunglasses"
}

enum HealthState {
  IDLE,
  DAMAGE,
  DEAD
}

export default class Character extends Phaser.Physics.Arcade.Sprite {

  private selectedSkin: Skin = Skin.BLUE
  private healthState = HealthState.IDLE
  private damageTime = 0

  private _health = 5
  private _hunger = 5

  private activeChest?: Chest

  get health() {
    return this._health
  }

  get hunger() {
    return this._hunger
  }

  set skin(skin: Skin) {
    this.selectedSkin = skin
  }

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame)

    this.anims.play(`idle-${this.selectedSkin}`);
    scene.physics.add.existing(this, false);

    this.scene.time.addEvent({
      delay: 5 * 60 * 1000,
      callback: this.getHungry,
      callbackScope: this,
      loop: true,
    });
  }

  protected preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta)

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
    if (this.healthState === HealthState.DAMAGE || this.healthState === HealthState.DEAD) return
    if (!cursors) return;

    const speed = 100

    const leftDown = cursors.left?.isDown
    const rightDown = cursors.right?.isDown
    const upDown = cursors.up?.isDown
    const downDown = cursors.down?.isDown


    if (leftDown) {
      this.anims.play(`run-${this.selectedSkin}`, true);
      this.setVelocity(-speed, 0);
      this.scaleX = -1;
      this.body?.offset.setTo(24, 8);

    } else if (rightDown) {
      this.anims.play(`run-${this.selectedSkin}`, true);
      this.setVelocity(speed, 0);
      this.scaleX = 1;
      this.body?.offset.setTo(8, 8);

    } else if (upDown) {
      this.anims.play(`run-${this.selectedSkin}`);
      this.setVelocity(0, -speed);

    } else if (downDown) {
      this.anims.play(`run-${this.selectedSkin}`);
      this.setVelocity(0, speed);

    } else if (cursors.space?.isDown && this.activeChest) {
      this.activeChest.open()

    } else {
      this.anims.play(`idle-${this.selectedSkin}`);
      this.setVelocity(0, 0);
    }

    if (leftDown || rightDown || upDown || downDown) {
      this.activeChest = undefined
    }
  }

  handleDamage(dir: Phaser.Math.Vector2) {
    if (this._health <= 0) return

    if (this.healthState === HealthState.DAMAGE) return

    --this._health

    if (this._health <= 0) {
      this.healthState = HealthState.DEAD
      this.anims.play(`idle-${this.selectedSkin}`);
      this.setVelocity(0, 0)
    } else {
      this.setVelocity(dir.x, dir.y)
      this.setTint(0xff0000)
      this.healthState = HealthState.DAMAGE
      this.damageTime = 0
    }
  }

  eat() {
    this._hunger += 1
    sceneEvents.emit('player-hunger-changed', this._hunger)
  }

  getHungry() {
    console.log("geHungry")
    this._hunger -= 1
    sceneEvents.emit('player-hunger-changed', this._hunger)
  }

  setChest(chest: Chest) {
    this.activeChest = chest
  }
}