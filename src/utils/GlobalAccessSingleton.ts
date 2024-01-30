import Cat from "@/npcs/Cat";
import CatOwner from "@/npcs/CatOwner";
import Npc from "@/npcs/Npc";
import { Area } from "@/types/Area";

export class Singleton {
  private static instance: Singleton | null = null;

  public interactiveObjects: (Phaser.Types.Tilemaps.TiledObject | Npc)[] = []
  public catOwner: CatOwner
  public cat: Cat
  public areas: Area[]

  private constructor() {
  }

  public static getInstance(): Singleton {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  }
}