import { Events, sceneEvents } from "@/events/EventsCenter"
import Interactable from "./Interactable"

export default class GrandpaDoor implements Interactable {
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

    this.scene.scene.pause("GrandpaScene")
    this.scene.scene.setVisible(false, "GrandpaScene")
    this.scene.scene.run("LilFox")
    this.scene.scene.setVisible(true, "LilFox")

    sceneEvents.emit(Events.FOX_GAME_LEVEL_STARTED)
  }
}
