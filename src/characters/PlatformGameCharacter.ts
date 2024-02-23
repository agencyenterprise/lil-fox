import { Events, sceneEvents } from "@/events/EventsCenter"
import Character from "./Character"
import { SoundEffects, SoundSingleton } from "@/utils/SoundSingleton"

const NORMAL_SPEED = 110
const BOOSTED_SPEED = 200
const NORMAL_JUMP_SPEED = -3500
const BOOSTED_JUMP_SPEED = -4500

enum Potions {
  GREEN_POTION = "greenPotion",
  ORANGE_POTION = "orangePotion",
}

export default class PlatformGameCharacter extends Character {
  public isAlive = true
  public isGameOver = false
  public isJumping = false
  private jumpSpeed = NORMAL_JUMP_SPEED
  private speed = NORMAL_SPEED

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame)
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    this.moveFox(cursors)
  }

  moveFox(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    if (!this.isAlive || this.isGameOver) return

    const leftDown = cursors.left?.isDown
    const rightDown = cursors.right?.isDown
    const upDown = cursors.up?.isDown

    if (rightDown && upDown && !this.isJumping) {
      this.isJumping = true
      this.anims.play(`run-${this.selectedSkin}`, true)
      this.setVelocityX(this.speed)
      this.jump()
      this.scaleX = 1
      this.body?.offset.setTo(8, 12)
    } else if (leftDown && upDown && !this.isJumping) {
      this.isJumping = true
      this.anims.play(`run-${this.selectedSkin}`, true)
      this.setVelocity(-this.speed, 0)
      this.jump()
      this.scaleX = -1
      this.body?.offset.setTo(24, 12)
    } else if (leftDown) {
      this.anims.play(`run-${this.selectedSkin}`, true)
      this.setVelocityX(-this.speed)
      this.scaleX = -1
      this.body?.offset.setTo(24, 12)
    } else if (rightDown) {
      this.anims.play(`run-${this.selectedSkin}`, true)
      this.setVelocityX(this.speed)
      this.scaleX = 1
      this.body?.offset.setTo(8, 12)
    } else if (upDown && !this.isJumping) {
      this.isJumping = true
      this.anims.play(`run-${this.selectedSkin}`)
      this.jump()
    } else {
      this.anims.play(`idle-${this.selectedSkin}`)
      this.setVelocityX(0)
    }
  }

  drinkPotion(potionName: string) {
    if (potionName === Potions.GREEN_POTION) {
      this.speed = BOOSTED_SPEED
      setTimeout(() => {
        this.speed = NORMAL_SPEED
      }, 10000)
    } else if (potionName === Potions.ORANGE_POTION) {
      this.jumpSpeed = BOOSTED_JUMP_SPEED
      setTimeout(() => {
        this.jumpSpeed = NORMAL_JUMP_SPEED
      }, 10000)
    }

    SoundSingleton.getInstance().playSoundEffect(SoundEffects.POWER_UP)
  }

  jump() {
    this.setAccelerationY(this.jumpSpeed)

    if (this.jumpSpeed == BOOSTED_JUMP_SPEED) {
      SoundSingleton.getInstance().playSoundEffect(SoundEffects.JUMP_BIG)
    } else {
      SoundSingleton.getInstance().playSoundEffect(SoundEffects.JUMP_SMALL)
    }

    setTimeout(() => {
      this.setAccelerationY(0)
    }, 150)
  }

  die() {
    this.anims.play(`hurt-${this.selectedSkin}`, true)
    this.setVelocityX(0)
    this.jumpSpeed = NORMAL_JUMP_SPEED
    this.jump()
    this.isAlive = false
    SoundSingleton.getInstance().playSoundEffect(SoundEffects.DAMAGE)

    setTimeout(() => {
      sceneEvents.emit(Events.GAME_OVER)
    }, 900)
  }

  gameOver() {
    this.anims.play(`idle-${this.selectedSkin}`)
    this.setVelocity(0, 0)
    this.setAcceleration(0, 0)
    this.isGameOver = true
  }
}
