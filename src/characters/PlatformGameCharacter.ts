import { Events, sceneEvents } from "@/events/EventsCenter";
import Character from "./Character";

const NORMAL_SPEED = 110
const BOOSTED_SPEED = 200
const NORMAL_JUMP_SPEED = -3500
const BOOSTED_JUMP_SPEED = -4500

export default class PlatformGameCharacter extends Character {

  public isAlive = true
  public isJumping = false
  private jumpSpeed = NORMAL_JUMP_SPEED
  private speed = NORMAL_SPEED

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame)
  }

  update(
    cursors: Phaser.Types.Input.Keyboard.CursorKeys,
  ) {
    if (!cursors) return;
    const spaceJustDown = Phaser.Input.Keyboard.JustDown(cursors.space)

    if (!this.isAlive && spaceJustDown) {
      sceneEvents.emit(Events.HIDE_CHARACTER_DIED_MODAL)
      this.scene.scene.restart()
    }

    this.moveFox(cursors)
  }

  moveFox(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    if (!this.isAlive) return

    const leftDown = cursors.left?.isDown
    const rightDown = cursors.right?.isDown
    const upDown = cursors.up?.isDown

    if (rightDown && upDown && !this.isJumping) {
      this.isJumping = true
      this.anims.play(`run-${this.selectedSkin}`, true);
      this.setVelocityX(this.speed);
      this.jump()
      this.scaleX = 1;
      this.body?.offset.setTo(8, 12);

    } else if (leftDown && upDown && !this.isJumping) {
      this.isJumping = true
      this.anims.play(`run-${this.selectedSkin}`, true);
      this.setVelocity(-this.speed, 0);
      this.jump()
      this.scaleX = -1;
      this.body?.offset.setTo(24, 12);

    } else if (leftDown) {
      this.anims.play(`run-${this.selectedSkin}`, true);
      this.setVelocityX(-this.speed);
      this.scaleX = -1;
      this.body?.offset.setTo(24, 12);

    } else if (rightDown) {
      this.anims.play(`run-${this.selectedSkin}`, true);
      this.setVelocityX(this.speed);
      this.scaleX = 1;
      this.body?.offset.setTo(8, 12);

    } else if (upDown && !this.isJumping) {
      this.isJumping = true
      this.anims.play(`run-${this.selectedSkin}`);
      this.jump()

    } else {
      this.anims.play(`idle-${this.selectedSkin}`);
      this.setVelocityX(0);
    }
  }

  handleInteraction(object: Phaser.Types.Tilemaps.TiledObject | Npc) {
    console.log("test")
  }

  drinkPotion(potionName: string) {
    if (potionName === "greenPotion") {
      this.speed = BOOSTED_SPEED
      setTimeout(() => {
        this.speed = NORMAL_SPEED
      }, 10000)
    } else if (potionName === "orangePotion") {
      this.jumpSpeed = BOOSTED_JUMP_SPEED
      setTimeout(() => {
        this.jumpSpeed = NORMAL_JUMP_SPEED
      }, 10000)
    }
  }

  jump() {
    this.setAccelerationY(this.jumpSpeed);
    setTimeout(() => {
      this.setAccelerationY(0);
    }, 150)
  }

  die() {
    this.anims.play(`hurt-${this.selectedSkin}`, true);
    this.setVelocityX(0);
    this.jumpSpeed = NORMAL_JUMP_SPEED
    this.jump()
    this.isAlive = false

    setTimeout(() => {
      sceneEvents.emit(Events.CHARACTER_DIED)
    }, 900)
  }
}