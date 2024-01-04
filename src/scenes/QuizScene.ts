export default class QuizScene extends Phaser.Scene {

  private container: Phaser.GameObjects.Container

  constructor() {
    super({ key: 'QuizScene' });
  }

  create() {
    const { width, height } = this.scale
    this.add.image(400, 300, 'face').setAlpha(0.5);

    const panel = this.add.rectangle(
      0,
      0,
      width,
      height,
      0xede4f3,
      0.9
    ).setOrigin(0)
      .setStrokeStyle(3, 0x905ac2, 1)
    this.container = this.add.container(0, 0, [panel])

    // this.uiText = this.scene.add.text(18, 12, "", {
    //   ...UI_TEXT_STYLE,
    //   ...{ wordWrap: { width: this.width - 18 } },
    // })

    // this.container.add(this.uiText)


    this.input.once('pointerdown', () => {
      this.scene.resume('LilFox');
    }, this);
  }
}
