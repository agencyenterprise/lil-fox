import Character from "@/characters/Character";

export class Area extends Phaser.Geom.Rectangle {

  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height)
  }

  handleCharacterInArea(character?: Character): void {
    console.log("Abstract area")
  }
}