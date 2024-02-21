import { animateText } from "@/utils/textUtils"
import Phaser from "phaser"

const UI_TEXT_STYLE: Phaser.Types.GameObjects.Text.TextStyle = Object.freeze({
  color: 'black',
  fontSize: '10px',
  wordWrap: { width: 0 },
})

export class Dialog {
  private scene: Phaser.Scene
  private padding: number
  private width: number
  private height: number
  private container: Phaser.GameObjects.Container
  private _isVisible: boolean = false
  private userInputCursor: Phaser.GameObjects.Image
  private userInputCursorTween: Phaser.Tweens.Tween
  private uiText: Phaser.GameObjects.Text
  private textAnimationPlaying: boolean = false
  private messagesToShow: string[] = []
  private optionsContainer: Phaser.GameObjects.Container

  constructor(scene: Phaser.Scene, width: number) {
    this.scene = scene
    this.padding = 5
    this.width = width - this.padding * 2
    this.height = 50

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
    this.createPlayerInputCursor()

    this.hideDialogModal()
  }

  showMessage(message: string) {
    if (this.textAnimationPlaying) return

    this.height - 10
    this.container.setPosition(50, 185)
    this.userInputCursorTween.restart()
    this.container.setAlpha(1)
    this._isVisible = true

    this.uiText.setText("").setAlpha(1)
    animateText(this.scene, this.uiText, message, {
      delay: 30,
      callback: () => {
        this.textAnimationPlaying = false
      }
    })
    this.textAnimationPlaying = true
  }

  hideDialogModal() {
    this.container.setAlpha(0)
    this.userInputCursorTween.pause()
    this._isVisible = false
  }

  askQuestion(question: string, options: string[], callback: (answer: string) => void) {
    if (this.textAnimationPlaying) return

    this.height - 10
    this.container.setPosition(50, 185)
    this.userInputCursorTween.restart()
    this.container.setAlpha(1)
    this._isVisible = true

    this.uiText.setText("").setAlpha(1)

    const halfHeight = this.height / 2

    options.forEach((option, index) => {
      const x = this.getXCoordinatesForOption(index)
      const text: Phaser.GameObjects.Text = new Phaser.GameObjects.Text(this.scene, x, halfHeight, option, { ...UI_TEXT_STYLE }).setOrigin(0.5, 0.5)
      this.container.add(text)
    })
  }

  createPlayerInputCursor() {
    const y = this.height - 12
    this.userInputCursor = this.scene.add.image(this.width - 8, y, 'cursor')
    this.userInputCursor.setAngle(90).setScale(3, 1)

    this.userInputCursorTween = this.scene.add.tween({
      delay: 0,
      duration: 500,
      repeat: -1,
      y: {
        from: y,
        start: y,
        to: y + 2,
      },
      targets: this.userInputCursor,
    })

    this.userInputCursorTween.pause()
    this.container.add(this.userInputCursor)
  }

  getXCoordinatesForOption(index: number): number {
    if (index === 0) {
      return this.width / 2 - 25
    } else if (index === 1) {
      return this.width / 2 + 25
    } else if (index === 2) {
      return this.width / 2 - 90
    } else {
      return this.width / 2 + 90
    }
  }

  get isVisible() {
    return this._isVisible
  }

  get isAnimationPlaying() {
    return this.textAnimationPlaying
  }

  get moreMessagesToShow() {
    return this.messagesToShow.length > 0
  }
}