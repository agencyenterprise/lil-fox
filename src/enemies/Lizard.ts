import { SoundEffects, SoundSingleton } from "@/utils/SoundSingleton"
import { Direction } from "@/utils/gridUtils"
import Phaser from "phaser"

export const randomDirection = (exclude: Direction): Direction => {
  const directions = [
    Direction.UP,
    Direction.DOWN,
    Direction.LEFT,
    Direction.RIGHT,
  ]
  let newDirection = exclude

  while (newDirection === exclude) {
    newDirection = directions[Math.floor(Math.random() * directions.length)]
  }

  return newDirection
}

export default class Lizard extends Phaser.Physics.Arcade.Sprite {
  private direction = Direction.RIGHT
  private moveEvent: Phaser.Time.TimerEvent

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number,
  ) {
    super(scene, x, y, texture, frame)

    this.anims.play("lizard-idle")

    scene.physics.world.on(
      Phaser.Physics.Arcade.Events.TILE_COLLIDE,
      this.changeDirection,
      this,
    )

    this.moveEvent = scene.time.addEvent({
      delay: 2000,
      loop: true,
      callback: () => {
        this.direction = randomDirection(this.direction)
      },
    })
  }

  destroy(fromScene?: boolean | undefined) {
    this.moveEvent.destroy()
    super.destroy(fromScene)
  }

  changeDirection(
    go: Phaser.GameObjects.GameObject,
    tile?: Phaser.Tilemaps.Tile,
  ) {
    if (go !== this) return

    this.direction = randomDirection(this.direction)

    if (this.scene.cameras.main.worldView.contains(this.x, this.y)) {
      SoundSingleton.getInstance().playSoundEffect(SoundEffects.ROAR)
    }
  }

  protected preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta)

    this.setSize(this.width, this.height * 0.6)
    this.body?.offset.setTo(0, 12)

    const speed = 50

    switch (this.direction) {
      case Direction.UP:
        this.setVelocity(0, -speed)
        break
      case Direction.DOWN:
        this.setVelocity(0, speed)
        break
      case Direction.LEFT:
        this.setVelocity(-speed, 0)
        break
      case Direction.RIGHT:
        this.setVelocity(speed, 0)
        break
    }
  }
}
