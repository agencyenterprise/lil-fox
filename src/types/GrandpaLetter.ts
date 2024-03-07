import { Events, sceneEvents } from "@/events/EventsCenter"
import Interactable from "./Interactable"

export class GrandpaLetter implements Interactable {
  public x: number = 0
  public y: number = 0
  scene: Phaser.Scene
  public hasPlayerInteracted: boolean = false
  public interactionCount: number = 0

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.x = x
    this.y = y
    this.scene = scene
  }

  handleInteraction(): void {
    this.hasPlayerInteracted = true
    this.interactionCount++

    if (this.interactionCount === 1) {
      sceneEvents.emit(Events.LOCK_PLAYER_MOVEMENT, true)
      sceneEvents.emit(Events.GRANDPA_LETTER_OPEN)
    } else {
      sceneEvents.emit(Events.LOCK_PLAYER_MOVEMENT, false)
      sceneEvents.emit(Events.GRANDPA_LETTER_READ)
    }
  }
}
