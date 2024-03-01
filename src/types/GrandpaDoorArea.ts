import Character from "@/characters/Character"
import { Area } from "./Area"
import { Events, sceneEvents } from "@/events/EventsCenter"

export class GrandpaDoorArea extends Area {
  scene: Phaser.Scene

  constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
    super(x, y, width, height)
    this.scene = scene
  }

  handleCharacterInArea(character?: Character): void {
    this.scene.scene.pause("GrandpaScene")
    this.scene.scene.setVisible(false, "GrandpaScene")
    this.scene.scene.run("LilFox")
    this.scene.scene.setVisible(true, "LilFox")

    sceneEvents.emit(Events.FOX_GAME_LEVEL_STARTED)
  }
}
