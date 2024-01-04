import { Direction } from "@/utils/gridUtils"

const UI_TEXT_STYLE: Phaser.Types.GameObjects.Text.TextStyle = Object.freeze({
  color: 'black',
  fontSize: '10px',
  wordWrap: { width: 0 },
})
export default class QuizScene extends Phaser.Scene {


  private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys
  private menuCursorImage: Phaser.GameObjects.Image
  private selectedOption: number = 1;

  constructor() {
    super({ key: 'QuizScene' });
  }

  create() {
    const { width, height } = this.scale

    this.add.rectangle(
      0,
      0,
      width,
      height,
      0xede4f3,
      // 0.9
    ).setOrigin(0)
      .setStrokeStyle(3, 0x905ac2, 1)

    this.add.text(18, 12, "FALA TU CAMARADINHA", {
      ...UI_TEXT_STYLE,
      ...{ wordWrap: { width: width - 18 } },
    })

    this.add.rectangle(
      0,
      height - 50,
      width,
      47,
      0x42f572,
      // 0.9
    ).setOrigin(0)
      .setStrokeStyle(3, 0x905ac2, 1)


    const container = this.add.container(0, 0)

    const halfWidth = width / 2
    this.add.text(halfWidth - 60, height - 35, "OPTION 1", { ...UI_TEXT_STYLE, wordWrap: { width: width - 18 } }).setOrigin(0.5, 0.5)
    this.add.text(halfWidth - 60, height - 15, "OPTION 2", { ...UI_TEXT_STYLE, wordWrap: { width: width - 18 } }).setOrigin(0.5, 0.5)
    this.add.text(halfWidth + 40, height - 35, "OPTION 3", { ...UI_TEXT_STYLE, wordWrap: { width: width - 18 } }).setOrigin(0.5, 0.5)
    this.add.text(halfWidth + 40, height - 15, "OPTION 4", { ...UI_TEXT_STYLE, wordWrap: { width: width - 18 } }).setOrigin(0.5, 0.5)

    this.menuCursorImage = this.add.image(halfWidth - 90, height - 35, 'cursor', 0).setOrigin(0.5, 0.5)

    this.cursorKeys = this.input.keyboard!.createCursorKeys();
  }

  update() {
    const wasSpaceKeyPressed = Phaser.Input.Keyboard.JustDown(this.cursorKeys.space);
    // if (wasSpaceKeyPressed) {
    //   this.#battleMenu.handlePlayerInput('OK');
    //   return;
    // }

    // if (Phaser.Input.Keyboard.JustDown(this.#cursorKeys.shift)) {
    //   this.#battleMenu.handlePlayerInput('CANCEL');
    //   return;
    // }

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
