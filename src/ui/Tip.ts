import Phaser from "phaser"

const UI_TEXT_STYLE: Phaser.Types.GameObjects.Text.TextStyle = Object.freeze({
  color: 'black',
  fontSize: '10px',
  wordWrap: { width: 0 },
})

export class Tip {
  private scene: Phaser.Scene
  private padding: number
  private width: number = 280
  private height: number = 20
  private container: Phaser.GameObjects.Container
  private _isVisible: boolean = false
  private uiText: Phaser.GameObjects.Text

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.padding = 5
    this.width = this.width - this.padding * 2

    const panel = this.scene.add.rectangle(
      0,
      0,
      this.width,
      this.height,
      0xede4f3,
      0.9
    ).setOrigin(0)
      .setStrokeStyle(3, 0x905ac2, 1)
    this.container = this.scene.add.container(0, 0, [panel])

    this.uiText = this.scene.add.text(18, 6, "", {
      ...UI_TEXT_STYLE,
      ...{ wordWrap: { width: this.width - 18 } },
    })

    this.container.add(this.uiText)
    this.hideTip()
  }

  showTip() {
    this.height - 10
    this.container.setPosition(125, 220)
    this.container.setAlpha(1)
    this._isVisible = true

    this.uiText.setText("Press space next to the sign to read it.").setAlpha(1)
  }

  hideTip() {
    this.container.setAlpha(0)
    this._isVisible = false
  }

  get isVisible() {
    return this._isVisible
  }
}