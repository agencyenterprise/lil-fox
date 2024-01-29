import CatOwner from "@/npcs/CatOwner";

export class Singleton {
  private static instance: Singleton | null = null;

  public interactiveObjects: Phaser.Types.Tilemaps.TiledObject[]
  public catOwner: CatOwner
  public areas: Phaser.Geom.Rectangle[]

  private constructor() {
  }

  public static getInstance(): Singleton {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  }
}