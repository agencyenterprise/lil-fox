import { Singleton } from "@/utils/GlobalAccessSingleton"
import { TILE_SIZE } from "@/utils/gridUtils"
import Character from "./Character"

export default class IntroductionCharacter extends Character {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame)
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    if (!cursors) return
    const spaceJustDown = Phaser.Input.Keyboard.JustDown(cursors.space)

    this.isCharacterInArea(Singleton.getInstance().areas)

    if (spaceJustDown) {
      const nearbyArea = new Phaser.Geom.Circle(this.x, this.y, TILE_SIZE)

      const nearbyObject = Singleton.getInstance().interactiveObjects.find((obj) => {
        return nearbyArea.contains(obj.x!, obj.y!)
      })
      if (nearbyObject) {
        this.interactWithObject(nearbyObject)
      }
    }

    this.moveFox(cursors)
  }
}
