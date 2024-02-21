import { Direction } from "@/utils/gridUtils"
import Phaser from "phaser"
import Npc from "./Npc"
import Character from "@/characters/Character"
import { Events, sceneEvents } from "@/events/EventsCenter"
import { SoundSingleton, SoundEffects } from "@/utils/SoundSingleton"
import GameUI from "@/scenes/GameUI"
import { isTextAnimationBeingPlayed } from "@/utils/DialogUtils"

export default class HumanInBlue extends Npc {
  private direction: Direction | null = Direction.UP
  private moveEvent: Phaser.Time.TimerEvent

  private messages = [
    "Hey you! I have a quest for you, do you think you can handle it?", 
    "You need to collect as many coins as you can in under 50 seconds, but don't even bother showing me your face again if don't collect at least 100."
  ]

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number,
  ) {
    super(scene, x, y, texture, frame)

    this.anims.play("human_in_blue_walking_up")

    this.moveEvent = scene.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => this.changeDirection(),
    })
  }

  changeDirection() {
    if (this.direction === Direction.UP) {
      this.direction = Direction.DOWN
      this.anims.play("human_in_blue_walking_down")
    } else {
      this.direction = Direction.UP
      this.anims.play("human_in_blue_walking_up")
    }
  }

  stopMoving() {
    this.moveEvent.destroy()
    this.direction = null
    this.setVelocity(0, 0)
    this.anims.play("human_in_blue_looking_left")
  }

  handleInteraction(character?: Character): void {
    if (isTextAnimationBeingPlayed()) return

    this.stopMoving()

    if (this.interactionCount === 0) {
      SoundSingleton.getInstance().playSoundEffect(
        SoundEffects.CATOWNER_HELLO,
      )
      sceneEvents.emit(Events.LOCK_PLAYER_MOVEMENT, true)
    } 
    
    if (this.interactionCount === 2) {
      const gameUi: GameUI = this.scene.scene.get("game-ui") as GameUI
      gameUi.dialogUi.askQuestion(
        "Do you want to start the quest?",
        ["Yes", "No"],
        (answer: string) => {
          if (answer === "Yes") {
            console.log("Said YES")
          } else {
            console.log("Said NO")
          }
        }
      )

      // this.scene.scene.pause("LilFox")
      // this.scene.scene.setVisible(false, "LilFox")
      // this.scene.scene.run("MarioScene")
      // this.scene.scene.setVisible(true, "MarioScene");
      // sceneEvents.emit(Events.MARIO_LIKE_LEVEL_STARTED)
    } else {
      this.showMessage()
    }
    
    // if (this.interactionCount === this.messages.length) {
    //   this.interactionCount = 0
    //   sceneEvents.emit(Events.LOCK_PLAYER_MOVEMENT, false)
    //   this.hideDialog()
    // }

    super.handleInteraction()
  }
 
  showMessage() {
    const gameUi: GameUI = this.scene.scene.get("game-ui") as GameUI
    gameUi.showDialog(this.messages[this.interactionCount])
  }

  hideDialog() {
    const gameUi: GameUI = this.scene.scene.get("game-ui") as GameUI
    gameUi.hideDialog()
  }

  protected preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta)

    this.setSize(this.width, this.height * 0.6)
    this.body?.offset.setTo(0, 12)

    if (!this.direction) return

    const speed = 30

    switch (this.direction) {
      case Direction.UP:
        this.setVelocity(0, -speed)
        break
      case Direction.DOWN:
        this.setVelocity(0, speed)
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
