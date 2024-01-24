import { animateText } from "@/utils/textUtils"
import Phaser from "phaser"

const UI_TEXT_STYLE: Phaser.Types.GameObjects.Text.TextStyle = Object.freeze({
  color: 'black',
  fontSize: '10px',
  wordWrap: { width: 0 },
})

export class CharacterDiedDialog {
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

    this.uiText1 = this.scene.add.text(this.width / 2 - 30, 30, "", {
      ...UI_TEXT_STYLE,
      ...{ wordWrap: { width: this.width - 18 } },
    })

    this.uiText2 = this.scene.add.text(this.width / 2 - 62, 90, "", {
      ...UI_TEXT_STYLE,
      ...{ wordWrap: { width: this.width - 18 } },
    })

    this.uiText1.setText("YOU DIED!")
    this.uiText2.setText("Press space to respawn")

    this.container.add(this.uiText1)
    this.container.add(this.uiText2)

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
    const y = 95
    const x = this.width / 2 - 75
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