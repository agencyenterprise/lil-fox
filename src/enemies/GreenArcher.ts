import Phaser from 'phaser'

export default class GreenArcher extends Phaser.Physics.Arcade.Sprite {

  private arrows?: Phaser.Physics.Arcade.Group
  private facingDirection = 'right'

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame)

    this.scene.time.addEvent({
      delay: 1000,
      callback: this.shootArrow,
      callbackScope: this,
      loop: true,
    });
  }

  shootArrow() {
    if (!this.arrows) return

    const arrow = this.arrows.get(this.x, this.y, 'green_arrow') as Phaser.Physics.Arcade.Image
    arrow.angle = 200

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
  }

  getArrowVector(): Phaser.Math.Vector2 {
    if (this.facingDirection === 'right') {
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