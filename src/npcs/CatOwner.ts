import { Direction } from "@/utils/gridUtils"
import Phaser from "phaser"
import Npc from "./Npc"
import Character from "@/characters/Character"
import { Events, sceneEvents } from "@/events/EventsCenter"
import { Singleton } from "@/utils/GlobalAccessSingleton"
import { SoundSingleton, SoundEffects } from "@/utils/SoundSingleton"
import GameUI from "@/scenes/GameUI"

export default class CatOwner extends Npc {
  private direction: Direction | null = Direction.RIGHT
  private moveEvent: Phaser.Time.TimerEvent
  private catDelivered = false

  private messages: string[] = [
    "Please help me! My cat runaway into the forest, I'm so desperate.",
    "Can you find him? I promise, if you find him I will give you something no money can buy! Make sure to check closely every corner, he loves to hide."
  ]

  private foundCatMessages: string[] = [
    "I can't believe you found my cat! Thank you so much!",
    "Please accept this (insert something awesome here) as a token of my gratitude!",
  ]

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number,
  ) {
    super(scene, x, y, texture, frame)

    this.anims.play("cat_owner_walking_left")

    this.moveEvent = scene.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => this.changeDirection(),
    })
  }

  changeDirection() {
    if (this.direction === Direction.RIGHT) {
      this.direction = Direction.LEFT
      this.anims.play("cat_owner_walking_right")
    } else {
      this.direction = Direction.RIGHT
      this.anims.play("cat_owner_walking_left")
    }
  }

  stopMoving() {
    this.moveEvent.destroy()
    this.direction = null
    this.setVelocity(0, 0)
    this.anims.play("cat_owner_standing")
  }

  handleInteraction(character?: Character): void {
    console.log({ interactionCount: this.interactionCount })
    if (this.interactionCount === 0) {
      this.stopMoving()
      SoundSingleton.getInstance().playSoundEffect(
        SoundEffects.CATOWNER_HELLO,
      )
    }

    if (Singleton.getInstance().hasPlayerFoundCat) {
      if (this.interactionCount < this.foundCatMessages.length) {
        this.showMessage()
        super.handleInteraction()
      } else if (this.interactionCount === this.foundCatMessages.length) {
        this.interactionCount = 0
        this.hideDialog()
        sceneEvents.emit(Events.LOCK_PLAYER_MOVEMENT, false)
      }

      if (!this.catDelivered) {
        this.catDelivered = true
        const cat = Singleton.getInstance().cat
        cat.shouldFollowPlayer = false
        this.scene.physics.moveTo(
          cat,
          this.x + 16,
          this.y - 10,
          undefined,
          1200,
        )
        setTimeout(() => {
          cat.stopCat()
        }, 1200)
      }

    } else {
      if (this.interactionCount < this.messages.length) {
        this.showMessage()
        super.handleInteraction()
      } else if (this.interactionCount === this.messages.length) {
        this.interactionCount = 0
        this.hideDialog()
        sceneEvents.emit(Events.LOCK_PLAYER_MOVEMENT, false)
      }
    }
  }

  protected preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta)

    this.setSize(this.width, this.height * 0.6)
    this.body?.offset.setTo(0, 12)

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

  showMessage() {
    const gameUi: GameUI = this.scene.scene.get("game-ui") as GameUI
    if (Singleton.getInstance().hasPlayerFoundCat) {
      gameUi.showDialog(this.foundCatMessages[this.interactionCount])
    } else {
      gameUi.showDialog(this.messages[this.interactionCount])
    }
  }

  hideDialog() {
    const gameUi: GameUI = this.scene.scene.get("game-ui") as GameUI
    gameUi.hideDialog()
  }

  setMessages(messages: string[]) {
    this.messages = messages
  }

  destroy(fromScene?: boolean | undefined) {
    this.moveEvent.destroy()
    super.destroy(fromScene)
  }
}
