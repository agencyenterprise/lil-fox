import Character from "@/characters/Character"
import { Area } from "./Area"
import { SoundSingleton } from "@/utils/SoundSingleton"

export class SoundArea extends Area {
  name: string

  constructor(
    name: string,
    x: number,
    y: number,
    width: number,
    height: number,
  ) {
    super(x, y, width, height)

    this.name = name
  }

  handleCharacterInArea(character?: Character): void {
    SoundSingleton.getInstance().addPlayerCurrentArea(this.name)
  }

  handleCharacterNotInArea(character?: Character): void {
    SoundSingleton.getInstance().removePlayerCurrentArea(this.name)
  }
}
