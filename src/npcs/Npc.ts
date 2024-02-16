import Character from "@/characters/Character";

export default abstract class Npc extends Phaser.Physics.Arcade.Sprite {

  public hasPlayerInteracted: boolean = false
  public interactionCount: number = 0

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame)
  }

  handleInteraction(character?: Character): void {
    this.hasPlayerInteracted = true
    this.interactionCount++
  }
}
