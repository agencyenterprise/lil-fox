import { Events, sceneEvents } from "@/events/EventsCenter"
import Interactable from "./Interactable"
import GameUI from "@/scenes/GameUI"
import { Singleton } from "@/utils/GlobalAccessSingleton"
import { isTextAnimationBeingPlayed } from "@/utils/DialogUtils"

export class GrandpaCollectible implements Interactable {
  public x: number = 0
  public y: number = 0
  scene: Phaser.Scene
  public hasPlayerInteracted: boolean = false
  public interactionCount: number = 0
  private message: string
  private collectedEvent: Events

  constructor(scene: Phaser.Scene, x: number, y: number, message: string, collectedEvent: Events) {
    this.x = x
    this.y = y
    this.scene = scene
    this.message = message
    this.collectedEvent = collectedEvent
  }

  handleInteraction(): void {
    if (isTextAnimationBeingPlayed()) return

    this.hasPlayerInteracted = true
    this.interactionCount++

    if (this.interactionCount === 1) {
      this.showMessage(this.message)
    } else if (this.interactionCount === 2) {
      this.hideMessage()
      this.interactionCount = 0

      sceneEvents.emit(this.collectedEvent)
    }
  }

  showMessage(message: string) {
    const gameUi: GameUI = Singleton.getInstance().gameUi
    gameUi.showDialog(message)
  }

  hideMessage() {
    const gameUi: GameUI = Singleton.getInstance().gameUi
    gameUi.hideDialog()
  }
}
