import Phaser from "phaser"

const UI_TEXT_STYLE: Phaser.Types.GameObjects.Text.TextStyle = Object.freeze({
  color: 'black',
  fontSize: '10px',
  wordWrap: { width: 0 },
})

const TEXT_1 = "Congratulations!"
const TEXT_2 = "You won the level by collecting XX coins!"
const OPTION_1 = "Try to get even more coins"
const OPTION_2 = "Leave"

export class WinMarioLikeLevelModal {
  private scene: Phaser.Scene
  private padding: number
  private width: number
  private height: number
  private container: Phaser.GameObjects.Container
  private _isVisible: boolean = false
  private userInputCursor: Phaser.GameObjects.Image
  private userInputCursorTween: Phaser.Tweens.Tween
  private uiText1: Phaser.GameObjects.Text
  private uiText2: Phaser.GameObjects.Text
  private uiOption1: Phaser.GameObjects.Text
  private uiOption2: Phaser.GameObjects.Text

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.padding = 5
    this.width = 310 - this.padding * 2
    this.height = 130

    const panel = this.scene.add.rectangle(
      0,
      0,
      this.width,
      this.height,
      0xede4f3,
      0.9
    ).setOrigin(0)
      .setStrokeStyle(3, 0x905ac2, 1)
    this.container = this.scene.add.container(50, 60, [panel])

    this.uiText1 = this.scene.add.text(this.width / 2, 30, "", {
      ...UI_TEXT_STYLE,
      ...{ wordWrap: { width: this.width - 18 } },
    }).setOrigin(0.5)

    this.uiText2 = this.scene.add.text(this.width / 2, 45, "", {
      ...UI_TEXT_STYLE,
      ...{ wordWrap: { width: this.width - 18 } },
    }).setOrigin(0.5)

    this.uiOption1 = this.scene.add.text(this.width / 2, 90, "", {
      ...UI_TEXT_STYLE,
      ...{ wordWrap: { width: this.width - 18 } },
    }).setOrigin(0.5)
    
    this.uiOption2 = this.scene.add.text(this.width / 2, 105, "", {
      ...UI_TEXT_STYLE,
      ...{ wordWrap: { width: this.width - 18 } },
    }).setOrigin(0.5)

    this.uiText1.setText(TEXT_1)
    this.uiText2.setText(TEXT_2)
    this.uiOption1.setText(OPTION_1)
    this.uiOption2.setText(OPTION_2)

    this.container.add(this.uiText1)
    this.container.add(this.uiText2)
    this.container.add(this.uiOption1)
    this.container.add(this.uiOption2)

    this.createPlayerInputCursor()

    this.hideDialogModal()
  }

  showDialogModal() {
    this.height - 10
    this.userInputCursorTween.restart()
    this.container.setAlpha(1)
    this._isVisible = true
  }

  hideDialogModal() {
    this.container.setAlpha(0)
    this.userInputCursorTween.pause()
    this._isVisible = false
  }

  createPlayerInputCursor() {
    const y = 90
    const x = this.width / 2 - 90
    this.userInputCursor = this.scene.add.image(x, y, 'cursor')
    this.userInputCursor.setScale(3, 1)

    this.userInputCursorTween = this.scene.add.tween({
      delay: 0,
      duration: 500,
      repeat: -1,
      x: {
        from: x,
        start: x,
        to: x + 2,
      },
      targets: this.userInputCursor,
    })

    this.userInputCursorTween.pause()
    this.container.add(this.userInputCursor)
  }

  get isVisible() {
    return this._isVisible
  }
}