import Cat from "@/npcs/Cat";
import CatOwner from "@/npcs/CatOwner";
import Npc from "@/npcs/Npc";
import { Area } from "@/types/Area";
import { Coordinate } from "./gridUtils";

export class Singleton {
  private static instance: Singleton | null = null;

  public interactiveObjects: (Phaser.Types.Tilemaps.TiledObject | Npc)[] = [];
  public catOwner: CatOwner;
  public cat: Cat;
  public areas: Area[];
  public playerTrack: Coordinate[] = [];
  public hasPlayerFoundCat = false;
  public soundEffectsEnabled = true;
  public musicVolume = 3;
  public soundEffectsVolume = 3;

  private constructor() {}

  public static getInstance(): Singleton {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  }

  public addToPlayerTrack(coordinate: Coordinate) {
    if (this.playerTrack.length > 0) {
      const lastPosition = this.playerTrack.at(-1)!;
      if (lastPosition.x === coordinate.x && lastPosition.y === coordinate.y) {
        return;
      }
    }

    this.playerTrack.push(coordinate);
  }

  public getNextPosition() {
    return this.playerTrack.splice(0, 1)[0];
  }
}
