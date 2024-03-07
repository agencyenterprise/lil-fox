import { Events, sceneEvents } from "@/events/EventsCenter"
import Interactable from "./Interactable"
import GameUI from "@/scenes/GameUI"
import { Singleton } from "@/utils/GlobalAccessSingleton"

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
    this.hasPlayerInteracted = true
    this.interactionCount++

    if (this.interactionCount === 1) {
      this.showLetter(this.message)
    } else if (this.interactionCount === 2) {
      this.hideLetter()
      this.interactionCount = 0

      sceneEvents.emit(this.collectedEvent)
    }
  }

  showLetter(message: string) {
    const gameUi: GameUI = Singleton.getInstance().gameUi
    gameUi.showDialog(message)
  }

  hideLetter() {
    const gameUi: GameUI = Singleton.getInstance().gameUi
    gameUi.hideDialog()
  }
}
