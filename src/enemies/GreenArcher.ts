import Phaser from "phaser"
import { SoundEffects, SoundSingleton } from "@/utils/SoundSingleton"

export default class GreenArcher extends Phaser.Physics.Arcade.Sprite {
  private arrows?: Phaser.Physics.Arcade.Group
  private moveEvent?: Phaser.Time.TimerEvent
  private facingDirection = "right"

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number,
  ) {
    super(scene, x, y, texture, frame)

    this.moveEvent = this.scene.time.addEvent({
      delay: 1000,
      callback: this.shootArrow,
      callbackScope: this,
      loop: true,
    })
  }

  destroy(fromScene?: boolean | undefined) {
    this.moveEvent!.destroy()
    super.destroy(fromScene)
  }

  shootArrow() {
    if (!this.arrows) return

    const arrow = this.arrows.get(
      this.x,
      this.y,
      "arrow",
    ) as Phaser.Physics.Arcade.Image

    arrow.setSize(16, 6)

    if (this.facingDirection === "right") {
      arrow.angle = 90
    } else {
      arrow.angle = 270
    }

    if (!arrow) {
      return
    }

    const vec = this.getArrowVector()

    arrow.setActive(true)
    arrow.setVisible(true)

    arrow.x += vec.x * 16
    arrow.y += vec.y * 16

    this.anims.play(`green_archer_shooting_${this.facingDirection}`)
    arrow.setVelocity(vec.x * 250, vec.y * 250)

    SoundSingleton.getInstance().playSoundEffect(
      SoundEffects.ARROW,
      "soundGreenArcherArea",
    )
  }

  getArrowVector(): Phaser.Math.Vector2 {
    if (this.facingDirection === "right") {
      return new Phaser.Math.Vector2(1, 0)
    } else {
      return new Phaser.Math.Vector2(-1, 0)
    }
  }

  setArrows(arrows: Phaser.Physics.Arcade.Group): GreenArcher {
    this.arrows = arrows
    return this
  }

  setFacingDirection(direction: string) {
    this.facingDirection = direction
  }
}
