import { Direction } from "@/utils/gridUtils"
import Phaser from "phaser"
import Npc from "./Npc"
import Character from "@/characters/Character"
import { Events, sceneEvents } from "@/events/EventsCenter"
import { Singleton } from "@/utils/GlobalAccessSingleton"
import { SoundSingleton, SoundEffects } from "@/utils/SoundSingleton"

export default class HumanInBlue extends Npc {
  private direction: Direction | null = Direction.UP
  private messages: string[] = []
  private moveEvent: Phaser.Time.TimerEvent

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
    console.log("HumanInBlue handleInteraction", this.interactionCount)
    this.stopMoving()

    if (this.interactionCount === 0) {
      SoundSingleton.getInstance().playSoundEffect(
        SoundEffects.CATOWNER_HELLO,
      )
    } else if (this.interactionCount === 2) {
      this.scene.scene.pause("LilFox")
      this.scene.scene.setVisible(false, "LilFox")
      this.scene.scene.run("MarioScene")
      this.scene.scene.setVisible(true, "MarioScene");
      sceneEvents.emit(Events.MARIO_LIKE_LEVEL_STARTED)
    }

    sceneEvents.emit(Events.SHOW_DIALOG, this.messages)

    super.handleInteraction()
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
