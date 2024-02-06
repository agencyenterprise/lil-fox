import Character from "./Character";

export default class PlatformGameCharacter extends Character {

  public isJumping = false
  private jumpSpeed = -1500
  private speed = 110

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame)
  }

  moveFox(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {

    const leftDown = cursors.left?.isDown
    const rightDown = cursors.right?.isDown
    const upDown = cursors.up?.isDown
    const downDown = cursors.down?.isDown

    console.log("jumping", this.isJumping)

    if (rightDown && upDown && !this.isJumping) {
      this.isJumping = true
      this.anims.play(`run-${this.selectedSkin}`, true);
      this.setVelocityX(this.speed);
      this.jump()
      this.scaleX = 1;
      this.body?.offset.setTo(8, 12);

    } else if (leftDown && upDown && !this.isJumping) {
      this.isJumping = true
      this.anims.play(`run-${this.selectedSkin}`, true);
      this.setVelocity(-this.speed, 0);
      this.jump()
      this.scaleX = -1;
      this.body?.offset.setTo(24, 12);

    } else if (leftDown) {
      this.anims.play(`run-${this.selectedSkin}`, true);
      this.setVelocityX(-this.speed);
      this.scaleX = -1;
      this.body?.offset.setTo(24, 12);

    } else if (rightDown) {
      this.anims.play(`run-${this.selectedSkin}`, true);
      this.setVelocityX(this.speed);
      this.scaleX = 1;
      this.body?.offset.setTo(8, 12);

    } else if (upDown && !this.isJumping) {
      this.isJumping = true
      this.anims.play(`run-${this.selectedSkin}`);
      this.jump()
      this.setVelocity(0, this.jumpSpeed);

    } else {
      this.anims.play(`idle-${this.selectedSkin}`);
      this.setVelocity(0, 0);
    }
  }

  jump() {
    this.setAccelerationY(-3500);
    setTimeout(() => {
      this.setAccelerationY(0);
    }, 150)
  }
}