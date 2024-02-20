import { Direction } from '@/utils/gridUtils'
import Phaser from 'phaser'

export default class Slug extends Phaser.Physics.Arcade.Sprite {

  private direction = Direction.RIGHT
  private moveEvent: Phaser.Time.TimerEvent

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame)

    this.anims.play('slug')

    scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_COLLIDE, this.changeDirection, this)

    this.moveEvent = scene.time.addEvent({
      delay: 2000,
      loop: true,
      callback: () => this.changeDirection()
    })
  }

  destroy(fromScene?: boolean | undefined) {
    this.moveEvent.destroy()
    super.destroy(fromScene)
  }

  changeDirection() {
    this.direction = this.direction === Direction.LEFT ? Direction.RIGHT : Direction.LEFT
    this.setFlipX(this.direction === Direction.LEFT)
  }

  protected preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta)

    this.setSize(this.width, this.height * 0.6)
    this.body?.offset.setTo(0, 12);

    const speed = 50

    switch (this.direction) {
      case Direction.LEFT:
        this.setVelocity(-speed, 0)
        break
      case Direction.RIGHT:
        this.setVelocity(speed, 0)
        break
    }
  }
}