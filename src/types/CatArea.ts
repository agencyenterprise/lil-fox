import Character from "@/characters/Character";
import { Area } from "./Area";
import { Events, sceneEvents } from "@/events/EventsCenter";
import { Singleton } from "@/utils/GlobalAccessSingleton";

export class CatArea extends Area {
  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height)
  }
  
  handleCharacterInArea(character?: Character): void {
    Singleton.getInstance().cat.setVisible(true)

    sceneEvents.emit(Events.SHOW_TIP)
  }
}