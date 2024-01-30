import Phaser from 'phaser'
import Npc from './Npc'
import Character from '@/characters/Character'

export default class Cat extends Npc {
  
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame)
    
    this.anims.play('cat_cleaning_head')
  }

  handleInteraction(character?: Character): void {
    throw new Error('Method not implemented.')
  }
}