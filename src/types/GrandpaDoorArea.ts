import Character from "@/characters/Character"
import { Area } from "./Area"
import { Events, sceneEvents } from "@/events/EventsCenter"
import { Singleton } from "@/utils/GlobalAccessSingleton"

export class GrandpaDoorArea extends Area {
  scene: Phaser.Scene

  constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
    super(x, y, width, height)
    this.scene = scene
  }

  handleCharacterInArea(character?: Character): void {
    Singleton.getInstance().gameUi.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      this.scene.scene.setVisible(false, "GrandpaScene")

      this.scene.scene.run("LilFox")
      this.scene.scene.setVisible(true, "LilFox")

      Singleton.getInstance().gameUi.cameras.main.fadeIn(500, 0, 0, 0)

      sceneEvents.emit(Events.FOX_GAME_LEVEL_STARTED)
    })

    this.scene.scene.pause("GrandpaScene")
    Singleton.getInstance().gameUi.cameras.main.fadeOut(500, 0, 0, 0)
  }
}
