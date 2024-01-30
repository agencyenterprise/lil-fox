import Character from "@/characters/Character";
import { Area } from "./Area";
import { Events, sceneEvents } from "@/events/EventsCenter";

export class TipArea extends Area {
  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height)
  }
  
  handleCharacterInArea(character?: Character): void {
    sceneEvents.emit(Events.SHOW_TIP)
  }
}