import Phaser from 'phaser'
import Npc from './Npc'
import Character from '@/characters/Character'
import { Events, sceneEvents } from '@/events/EventsCenter'
import { Singleton } from '@/utils/GlobalAccessSingleton'

export default class Cat extends Npc {

  private messages: string[] = []
  private shouldFollowPlayer = false

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame)

    this.anims.play('cat_cleaning_head')
  }

  update() {
    if (this.shouldFollowPlayer) this.followPlayer()
  }

  followPlayer() {
    const nextPosition = Singleton.getInstance().getNextPosition()
    const distanceBetweenCatAndCharacter = Phaser.Math.Distance.Between(nextPosition.x, nextPosition.y, this.x, this.y)

    if (distanceBetweenCatAndCharacter < 20) {
      this.body?.stop()
      return
    }

    this.scene.physics.moveTo(this, nextPosition.x, nextPosition.y, 50)
  }


  handleInteraction(character?: Character): void {
    sceneEvents.emit(Events.SHOW_DIALOG, this.messages)
    character!.startTrackingPosition()

    this.shouldFollowPlayer = true

    super.handleInteraction()
  }

  setMessages(messages: string[]) {
    this.messages = messages
  }
}