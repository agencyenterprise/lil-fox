import Phaser from 'phaser'

export default class GreenArcher extends Phaser.Physics.Arcade.Sprite {

  private arrows?: Phaser.Physics.Arcade.Group

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame)

    // this.anims.play('green_archer_shooting')

    this.arrows = scene.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
    })

    this.scene.time.addEvent({
      delay: 2000,
      callback: this.shootArrow,
      callbackScope: this,
      loop: true,
    });

  }

  destroy(fromScene?: boolean | undefined) {
    super.destroy(fromScene)
  }

  update(t: number, dt: number) {
    super.update(t, dt)
    console.log("updating")
  }

  private shootArrow() {
    console.log('shooting arrow')
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

    this.anims.play('green_archer_shooting')
    arrow.setVelocity(vec.x * 250, vec.y * 250)
  }
}