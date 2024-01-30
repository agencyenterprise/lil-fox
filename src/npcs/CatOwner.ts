import { Direction } from '@/utils/gridUtils'
import Phaser from 'phaser'
import Npc from './Npc'
import Character from '@/characters/Character'
import { Events, sceneEvents } from '@/events/EventsCenter'

export default class CatOwner extends Npc {

  private direction: Direction | null = Direction.RIGHT
  private messages: string[] = []
  private moveEvent: Phaser.Time.TimerEvent

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame)

    this.anims.play('cat_owner_walking_left')

    this.moveEvent = scene.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => this.changeDirection()
    })
  }

  changeDirection() {
    if (this.direction === Direction.RIGHT) {
      this.direction = Direction.LEFT
      this.anims.play('cat_owner_walking_right')
    } else {
      this.direction = Direction.RIGHT
      this.anims.play('cat_owner_walking_left')
    }
  }

  stopMoving() {
    this.moveEvent.destroy()
    this.direction = null
    this.setVelocity(0, 0)
    this.anims.play("cat_owner_standing")
  }

  handleInteraction(character?: Character): void {
    this.stopMoving()
    sceneEvents.emit(Events.SHOW_DIALOG, this.messages)
  }

  protected preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta)

    this.setSize(this.width, this.height * 0.6)
    this.body?.offset.setTo(0, 12);

    if (!this.direction) return

    const speed = 30

    switch (this.direction) {
      case Direction.LEFT:
        this.setVelocity(-speed, 0)
        break
      case Direction.RIGHT:
        this.setVelocity(speed, 0)
        break
    }
  }

  setMessages(messages: string[]) {
    this.messages = messages
  }

  destroy(fromScene?: boolean | undefined) {
    this.moveEvent.destroy()
    super.destroy(fromScene)
  }
}