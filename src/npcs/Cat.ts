import Phaser from 'phaser'
import Npc from './Npc'
import Character from '@/characters/Character'
import { Events, sceneEvents } from '@/events/EventsCenter'

export default class Cat extends Npc {

  private messages: string[] = []


  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame)

    this.anims.play('cat_cleaning_head')
  }

  handleInteraction(character?: Character): void {
    sceneEvents.emit(Events.SHOW_DIALOG, this.messages)

    super.handleInteraction()
  }

  setMessages(messages: string[]) {
    this.messages = messages
  }
}