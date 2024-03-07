import Phaser from 'phaser'
import Npc from './Npc'
import Character from '@/characters/Character'
import { Events, sceneEvents } from '@/events/EventsCenter'
import { Singleton } from '@/utils/GlobalAccessSingleton'
import { Direction } from '@/utils/gridUtils'
import GameUI from '@/scenes/GameUI'

export default class Cat extends Npc {

  private messages: string[] = ["Meeeeoooowww!", "MEEEEOWW!!!"]
  public shouldFollowPlayer = false
  private currentDirection: Direction = Direction.NONE

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame)

    this.anims.play('cat_cleaning_head')
  }

  update() {
    if (this.shouldFollowPlayer) {
      this.followPlayer()
      this.updateAnimation()
    }
  }

  followPlayer() {
    const nextPosition = Singleton.getInstance().getNextPosition()
    if (!nextPosition) return

    const distanceBetweenCatAndCharacter = Phaser.Math.Distance.Between(nextPosition.x, nextPosition.y, this.x, this.y)

    if (distanceBetweenCatAndCharacter < 20) {
      this.body?.stop()
      return
    }

    this.scene.physics.moveTo(this, nextPosition.x, nextPosition.y, 50)
  }

  updateAnimation() {
    if (this.body!.velocity.x > 0 && this.currentDirection !== Direction.RIGHT) {
      this.currentDirection = Direction.RIGHT
      this.setFlipX(false);
      this.anims.play('cat_walking')

    } else if (this.body!.velocity.x < 0 && this.currentDirection !== Direction.LEFT) {
      this.currentDirection = Direction.LEFT
      this.setFlipX(true);
      this.anims.play('cat_walking')

    } else if (this.body!.velocity.x === 0 && this.currentDirection !== Direction.NONE) {
      this.stopCat()
    }
  }

  stopCat() {
    this.body?.stop()
    this.currentDirection = Direction.NONE
    this.anims.play('cat_swinging_tail')
  }

  handleInteraction(character?: Character): void {
    console.log({ interactionCount: this.interactionCount, messagesLength: this.messages.length})
    if (this.interactionCount > this.messages.length) return

    if (this.interactionCount < this.messages.length) {
      this.showMessage()
      super.handleInteraction()
    } else if (this.interactionCount === this.messages.length) {
      this.shouldFollowPlayer = true
      character!.startTrackingPosition()
      Singleton.getInstance().hasPlayerFoundCat = true
      
      this.hideDialog()
      sceneEvents.emit(Events.LOCK_PLAYER_MOVEMENT, false)
      super.handleInteraction()
    }
  }

  showMessage() {
    const gameUi: GameUI = this.scene.scene.get("game-ui") as GameUI
    gameUi.showDialog(this.messages[this.interactionCount])
  }

  hideDialog() {
    const gameUi: GameUI = this.scene.scene.get("game-ui") as GameUI
    gameUi.hideDialog()
  }
}