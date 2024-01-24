import { Events, sceneEvents } from "@/events/EventsCenter";
import { Direction } from "@/utils/gridUtils"
import { animateText } from "@/utils/textUtils";
import { text } from "stream/consumers";

const UI_TEXT_STYLE: Phaser.Types.GameObjects.Text.TextStyle = Object.freeze({
  color: 'black',
  fontSize: '10px',
  wordWrap: { width: 0 },
})
export default class QuizScene extends Phaser.Scene {
  private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys
  private menuCursorImage: Phaser.GameObjects.Image
  private readMoreInputCursor: Phaser.GameObjects.Image
  private readMoreCursorTween: Phaser.Tweens.Tween
  private optionsContainer: Phaser.GameObjects.Container
  private textAnimationPlaying: boolean = false
  private uiText: Phaser.GameObjects.Text
  private selectedOption: number = 1;
  private messagesToShow: string[]
  private correctAlternative: number
  private levelNumber: number
  private showingFinalMessage: boolean = false

  constructor() {
    super({ key: 'QuizScene' });
  }

  init(data: any) {
    this.levelNumber = data.levelNumber
    this.messagesToShow = data.messages
    this.correctAlternative = data.correctAlternative
  }

  create() {
    const { width, height } = this.scale

    this.add.rectangle(0, 0, width, height, 0xede4f3).setOrigin(0).setStrokeStyle(3, 0x905ac2, 1)

    this.uiText = this.add.text(18, 12, "", {
      ...UI_TEXT_STYLE,
      ...{ wordWrap: { width: width - 18 } },
    })

    this.add.rectangle(0, height - 50, width, 47, 0xede4f3).setOrigin(0).setStrokeStyle(3, 0x905ac2, 1)


    const halfWidth = width / 2
    this.optionsContainer = this.add.container(0, 0, [
      this.add.text(halfWidth - 60, height - 35, "OPTION 1", { ...UI_TEXT_STYLE, wordWrap: { width: width - 18 } }).setOrigin(0.5, 0.5),
      this.add.text(halfWidth - 60, height - 15, "OPTION 2", { ...UI_TEXT_STYLE, wordWrap: { width: width - 18 } }).setOrigin(0.5, 0.5),
      this.add.text(halfWidth + 40, height - 35, "OPTION 3", { ...UI_TEXT_STYLE, wordWrap: { width: width - 18 } }).setOrigin(0.5, 0.5),
      this.add.text(halfWidth + 40, height - 15, "OPTION 4", { ...UI_TEXT_STYLE, wordWrap: { width: width - 18 } }).setOrigin(0.5, 0.5),
    ])

    const y = height - 63
    this.readMoreInputCursor = this.add.image(width - 14, y, 'cursor')
    this.readMoreInputCursor.setAngle(90).setScale(3, 2)

    this.readMoreCursorTween = this.add.tween({
      delay: 0,
      duration: 500,
      repeat: -1,
      y: {
        from: y,
        start: y,
        to: y + 2,
      },
      targets: this.readMoreInputCursor,
    })

    this.cursorKeys = this.input.keyboard!.createCursorKeys();

    this.showNextMessage()
  }

  update() {
    const wasSpaceKeyPressed = Phaser.Input.Keyboard.JustDown(this.cursorKeys.space);

    if (this.textAnimationPlaying) return

    if (this.messagesToShow.length > 0 && wasSpaceKeyPressed) {
      this.showNextMessage()
      return;
    }

    if (this.showingFinalMessage && wasSpaceKeyPressed) {
      this.handleFinalInput()
    }

    if (this.messagesToShow.length === 0 && wasSpaceKeyPressed) {
      this.showFinalMessage()
    }

    let selectedDirection: Direction = Direction.NONE;
    if (this.cursorKeys.left.isDown) {
      selectedDirection = Direction.LEFT;
    } else if (this.cursorKeys.right.isDown) {
      selectedDirection = Direction.RIGHT;
    } else if (this.cursorKeys.up.isDown) {
      selectedDirection = Direction.UP;
    } else if (this.cursorKeys.down.isDown) {
      selectedDirection = Direction.DOWN;
    }

    if (selectedDirection !== Direction.NONE) {
      this.handleInput(selectedDirection);
    }
  }

  showNextMessage() {
    if (this.messagesToShow.length === 0) return

    this.uiText.setText("").setAlpha(1)
    animateText(this, this.uiText, this.messagesToShow.shift()!, {
      delay: 10,
      callback: () => {
        this.textAnimationPlaying = false
      }
    })
    this.textAnimationPlaying = true

    if (this.messagesToShow.length === 0) {
      const { width, height } = this.scale
      const halfWidth = width / 2
      this.menuCursorImage = this.add.image(halfWidth - 90, height - 35, 'cursor', 0).setOrigin(0.5, 0.5)

      this.readMoreInputCursor.destroy()
      this.readMoreCursorTween.remove()
    }
  }

  showFinalMessage() {
    if (this.textAnimationPlaying) return

    const { width, height } = this.scale
    const halfWidth = width / 2

    this.optionsContainer.destroy()
    this.add.text(halfWidth, height - 25, "OK", { ...UI_TEXT_STYLE }).setOrigin(0.5, 0.5)
    this.menuCursorImage.setPosition(halfWidth - 13, height - 25)

    if (this.selectedOption === this.correctAlternative) {
      this.uiText.setText("").setAlpha(1)
      animateText(this, this.uiText, "Congratulations you choose the correct answer!", {
        delay: 10,
        callback: () => {
          this.textAnimationPlaying = false
        }
      })
      this.textAnimationPlaying = true

    } else {
      this.uiText.setText("").setAlpha(1)
      animateText(this, this.uiText, "You choose the wrong answer :(\nGo back to the beginning and try again.", {
        delay: 10,
        callback: () => {
          this.textAnimationPlaying = false
        }
      })
      this.textAnimationPlaying = true
    }

    this.showingFinalMessage = true
  }

  handleFinalInput() {
    if (this.textAnimationPlaying) return

    if (this.selectedOption === this.correctAlternative) {
      this.scene.setVisible(false)
      this.scene.pause()
      this.scene.resume("LilFox")
      sceneEvents.emit(`won-level-${this.levelNumber}`)
    } else {
      this.scene.setVisible(false)
      this.scene.pause()
      this.scene.start("LilFox", { levelNumber: this.levelNumber })
    }
  }

  handleInput(input: Direction) {
    if (this.selectedOption === 1) {
      switch (input) {
        case Direction.RIGHT:
          this.selectedOption = 3
          break
        case Direction.DOWN:
          this.selectedOption = 2
          break
        case Direction.UP:
        case Direction.LEFT:
        case Direction.NONE:
          return
        default:
          break;
      }
    } else if (this.selectedOption === 2) {
      switch (input) {
        case Direction.RIGHT:
          this.selectedOption = 4
          break
        case Direction.UP:
          this.selectedOption = 1
          break
        case Direction.DOWN:
        case Direction.LEFT:
        case Direction.NONE:
          return
        default:
          break;
      }
    } else if (this.selectedOption === 3) {
      switch (input) {
        case Direction.LEFT:
          this.selectedOption = 1
          break
        case Direction.DOWN:
          this.selectedOption = 4
          break
        case Direction.RIGHT:
        case Direction.UP:
        case Direction.NONE:
          return
        default:
          break;
      }
    } else if (this.selectedOption === 4) {
      switch (input) {
        case Direction.LEFT:
          this.selectedOption = 2
          break
        case Direction.UP:
          this.selectedOption = 3
          break
        case Direction.RIGHT:
        case Direction.DOWN:
        case Direction.NONE:
          return
        default:
          break;
      }
    }

    this.moveCursor()
  }

  moveCursor() {
    const { width, height } = this.scale
    const halfWidth = width / 2

    switch (this.selectedOption) {
      case 1:
        this.menuCursorImage.setPosition(halfWidth - 90, height - 35)
        break
      case 2:
        this.menuCursorImage.setPosition(halfWidth - 90, height - 15)
        break
      case 3:
        this.menuCursorImage.setPosition(halfWidth + 10, height - 35)
        break
      case 4:
        this.menuCursorImage.setPosition(halfWidth + 10, height - 15)
        break
    }
  }
}
