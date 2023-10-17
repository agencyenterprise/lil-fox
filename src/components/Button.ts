import Phaser from "phaser";

export class Button {
  constructor(
    x: number,
    y: number,
    label: string,
    scene: Phaser.Scene,
    callback: () => void
  ) {
    const button = scene.add
      .bitmapText(x, y, "pixelfont", label, 20)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => callback());
  }
}
