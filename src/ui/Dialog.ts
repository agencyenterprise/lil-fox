import { ReceivesInstructions } from "@/types/Modal"
import { animateText } from "@/utils/textUtils"
import Phaser from "phaser"

const UI_TEXT_STYLE: Phaser.Types.GameObjects.Text.TextStyle = Object.freeze({
  color: 'black',
  fontSize: '10px',
  wordWrap: { width: 0 },
})

export class Dialog implements ReceivesInstructions {
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
  private selectedOption = 0
  private isAskingQuestion = false
  private onAnswer: (selectedOption: number) => void
  private options: Phaser.GameObjects.Text[] = []

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
    ).setOrigin(0.5, 0)
      .setStrokeStyle(3, 0x905ac2, 1)

    this.uiText = this.scene.add.text(0, 5, "", {
      ...UI_TEXT_STYLE,
      ...{ wordWrap: { width: this.width - 18 } },
    }).setOrigin(0.5, 0)

    this.container = this.scene.add.container(this.scene.cameras.main.centerX, this.scene.scale.height * 0.60, [panel, this.uiText])

    this.userInputCursor = this.scene.add.image(this.width - 8, this.height - 12, 'cursor')
    this.createPlayerInputCursor()

    this.hideDialogModal()
  }

  select(): void {
    if (!this.isAskingQuestion) return
    this.onAnswer(this.selectedOption)
    this.isAskingQuestion = false
    this.options.forEach(option => option.destroy())
    this.userInputCursor.setVisible(false)
    this.userInputCursorTween.destroy()
  }

  downDown(): void {
  }

  upDown(): void {
  }

  leftDown(): void {
    if (!this.isAskingQuestion) return
    if (this.selectedOption === 0) return
    this.selectedOption = 0
    this.setCursor()
  }

  rightDown(): void {
    if (!this.isAskingQuestion) return
    if (this.selectedOption === 1) return
    this.selectedOption = 1
    this.setCursor()
  }

  showMessage(message: string) {
    if (this.textAnimationPlaying) return

    this.createPlayerInputCursor()

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
    this._isVisible = false
  }

  askQuestion(options: string[], onAnswer: (selectedOption: number) => void) {
    if (this.textAnimationPlaying) return

    this.userInputCursorTween.restart()
    this.container.setAlpha(1)
    this._isVisible = true

    this.uiText.setText("").setAlpha(1)

    const halfHeight = this.height / 2

    options.forEach((option, index) => {
      const x = this.getXCoordinatesForOption(index)
      const text: Phaser.GameObjects.Text = new Phaser.GameObjects.Text(this.scene, x, halfHeight, option, { ...UI_TEXT_STYLE }).setOrigin(0, 0.5)
      this.options.push(text)
      this.container.add(text)
    })

    this.setCursor()
    this.onAnswer = onAnswer
    this.isAskingQuestion = true
  }

  getXCoordinatesForOption(index: number): number {
    if (index === 0) {
      return -45
    } else {
      return 35
    }
  }

  getXCoordinatesForCursor(index: number): number {
    if (index === 0) {
      return -55
    } else {
      return 25
    }
  }


  createPlayerInputCursor() {
    const y = this.height - 12
    this.userInputCursor.setVisible(true)
    this.userInputCursor.setPosition(this.width - 8, this.height - 12)
    this.userInputCursor.setAngle(90).setScale(3, 1)

    if (this.userInputCursorTween) this.userInputCursorTween.destroy()

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

  setCursor() {
    const x = this.getXCoordinatesForCursor(this.selectedOption)
    const y = this.height / 2

    if (this.userInputCursorTween) this.userInputCursorTween.destroy()

    this.userInputCursor.setVisible(true)
    this.userInputCursor.setPosition(x, y)
    this.userInputCursor.setAngle(0)
    this.userInputCursorTween.destroy()
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
  }

  get isVisible() {
    return this._isVisible
  }

  get isAnimationPlaying() {
    return this.textAnimationPlaying
  }
}