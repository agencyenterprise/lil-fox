import Character from "./Character"

export default class IntroductionCharacter extends Character {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame)
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    this.moveFox(cursors)
  }
}
