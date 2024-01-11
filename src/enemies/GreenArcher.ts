import Phaser from 'phaser'

export default class GreenArcher extends Phaser.Physics.Arcade.Sprite {

  private arrows?: Phaser.Physics.Arcade.Group

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame)

    this.scene.time.addEvent({
      delay: 2000,
      callback: this.shootArrow,
      callbackScope: this,
      loop: true,
    });
  }

  private shootArrow() {
    if (!this.arrows) return

    const arrow = this.arrows.get(this.x, this.y, 'green_arrow') as Phaser.Physics.Arcade.Image
    arrow.angle = 200

    if (!arrow) {
      return
    }

    const vec = new Phaser.Math.Vector2(0, 1)


    arrow.setActive(true)
    arrow.setVisible(true)

    arrow.x += vec.x * 16
    arrow.y += vec.y * 16

    this.anims.play('green_archer_shooting_left')
    arrow.setVelocity(vec.x * 250, vec.y * 250)
  }

  setArrows(arrows: Phaser.Physics.Arcade.Group) {
    this.arrows = arrows
  }
}