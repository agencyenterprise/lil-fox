import Phaser from 'phaser';

export default class SettingsUI extends Phaser.Scene {

  private container!: Phaser.GameObjects.Container

  constructor(scene: Phaser.Scene) {
    super('settings-ui');

    const { width } = scene.scale
    this.container = scene.add.container(width - 10, 50)

    const panel 
  }
}