import Phaser from 'phaser';

export default class SettingsMenu {

  private container!: Phaser.GameObjects.Container

  constructor(scene: Phaser.Scene) {
    const { width } = scene.scale
    
    this.container = scene.add.container(width - 10, 50)

    const panel = scene.add.nineslice(0, 0, 'panel', 0, 150, 50, 24, 24)
      .setOrigin(1, 0)

    this.container.add(panel)
  }
}