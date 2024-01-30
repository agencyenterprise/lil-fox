import Character from "@/characters/Character";

export default abstract class Npc extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame)
  }

  abstract handleInteraction(character?: Character): void;
}
