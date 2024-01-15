import Chest from "@/items/Chest";
import Phaser from "phaser";
import { Events, sceneEvents } from "@/events/EventsCenter";
import { Direction, TILE_SIZE, getTargetPosition } from "@/utils/gridUtils";
import { getWonLevels } from "@/utils/localStorageUtils";

declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      character(
        x: number,
        y: number,
        texture: string,
        frame?: string | number
      ): Character;
    }
  }
}

export enum Skin {
  DEFAULT = "default",
  BLUE = "blue",
  FLASK = "flask",
  KUMAMON = "kumamon",
  SUNGLASSES = "sunglasses"
}

enum HealthState {
  IDLE,
  DAMAGE,
  DEAD
}

export default class Character extends Phaser.Physics.Arcade.Sprite {
  private currentDirection = Direction.NONE
  private selectedSkin: Skin = Skin.BLUE
  private healthState = HealthState.IDLE
  private damageTime = 0
  private isPlayerMovementLocked = false

  private _health = 5
  private _hunger = 5

  private activeChest?: Chest

  get health() {
    return this._health
  }

  get hunger() {
    return this._hunger
  }

  set skin(skin: Skin) {
    this.selectedSkin = skin
  }

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame)

    this.anims.play(`idle-${this.selectedSkin}`);
    scene.physics.add.existing(this, false);

    this.scene.time.addEvent({
      delay: 5 * 60 * 1000,
      callback: this.getHungry,
      callbackScope: this,
      loop: true,
    });

    sceneEvents.on(Events.LOCK_PLAYER_MOVEMENT, this.handleLockPlayerMovement, this)
    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      sceneEvents.off(Events.LOCK_PLAYER_MOVEMENT, this.handleLockPlayerMovement, this)
    })
  }

  protected preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta)

    switch (this.healthState) {
      case HealthState.IDLE:
        break;

      case HealthState.DAMAGE:
        this.damageTime += delta
        if (this.damageTime >= 250) {
          this.healthState = HealthState.IDLE
          this.setTint(0xffffff)
          this.damageTime = 0
        }
        break;
    }
  }

  update(
    cursors: Phaser.Types.Input.Keyboard.CursorKeys,
    signsLayer: Phaser.Tilemaps.ObjectLayer,
    areasLayer: Phaser.Geom.Rectangle[]
  ) {
    if (this.healthState === HealthState.DAMAGE || this.healthState === HealthState.DEAD) return
    if (!cursors) return;

    this.isCharacterInArea(areasLayer)

    if (Phaser.Input.Keyboard.JustDown(cursors.space)) {
      const coordinate = { x: this.x, y: this.y }
      const targetPosition = getTargetPosition(coordinate, this.currentDirection)

      const nearbySign = signsLayer.objects.find(sign => {
        if (!sign.x || !sign.y) return
        return sign.x >= targetPosition.x - 12 && sign.x <= targetPosition.x + 12 && sign.y >= targetPosition.y - 12 && sign.y <= targetPosition.y + 12
      })

      if (nearbySign) {
        this.handleSignInteraction(nearbySign)
      }
    }

    const speed = 85

    const leftDown = cursors.left?.isDown
    const rightDown = cursors.right?.isDown
    const upDown = cursors.up?.isDown
    const downDown = cursors.down?.isDown

    if (this.isPlayerMovementLocked) {
      this.anims.play(`idle-${this.selectedSkin}`);
      this.setVelocity(0, 0);
      return
    }

    if (leftDown) {
      this.anims.play(`run-${this.selectedSkin}`, true);
      this.setVelocity(-speed, 0);
      this.scaleX = -1;
      this.body?.offset.setTo(24, 12);
      this.currentDirection = Direction.LEFT

    } else if (rightDown) {
      this.anims.play(`run-${this.selectedSkin}`, true);
      this.setVelocity(speed, 0);
      this.scaleX = 1;
      this.body?.offset.setTo(8, 12);
      this.currentDirection = Direction.RIGHT

    } else if (upDown) {
      this.anims.play(`run-${this.selectedSkin}`);
      this.setVelocity(0, -speed);
      this.currentDirection = Direction.UP

    } else if (downDown) {
      this.anims.play(`run-${this.selectedSkin}`);
      this.setVelocity(0, speed);
      this.currentDirection = Direction.DOWN

    } else {
      this.anims.play(`idle-${this.selectedSkin}`);
      this.setVelocity(0, 0);
    }

    if (leftDown || rightDown || upDown || downDown) {
      this.activeChest = undefined
    }
  }

  isCharacterInArea(areasLayer: Phaser.Geom.Rectangle[]) {
    const isInArea = areasLayer.find(area => area.contains(this.x, this.y))
    if (isInArea) {
      sceneEvents.emit(Events.SHOW_TIP)
    } else {
      sceneEvents.emit(Events.SHOW_TIP, false)
    }
  }

  handleSignInteraction(sign: Phaser.Types.Tilemaps.TiledObject) {
    const wonLevels = getWonLevels()
    const props = sign.properties
    const messages = props.find((p: any) => p.name === 'message')?.value.split(";")
    const isFinishLevelSign = props.find((p: any) => p.name === 'isFinishLevelSign')?.value
    const levelNumber = props.find((p: any) => p.name === 'levelNumber')?.value

    if (isFinishLevelSign) {
      const correctAlternative = props.find((p: any) => p.name === 'correctAlternative')?.value
      const levelNumber = props.find((p: any) => p.name === 'levelNumber')?.value

      if (wonLevels.includes(levelNumber)) {
        sceneEvents.emit(Events.SHOW_DIALOG, ["You already won this level!"])
      } else {
        this.scene.scene.pause("LilFox");
        this.scene.scene.launch('QuizScene', { messages, correctAlternative, levelNumber });
      }
    } else {
      if (levelNumber && wonLevels.includes(levelNumber)) {
        sceneEvents.emit(Events.SHOW_DIALOG, ["You already won this level!"])
      } else {
        sceneEvents.emit(Events.SHOW_DIALOG, messages)
      }
    }
  }

  handleLockPlayerMovement(lock: boolean) {
    this.isPlayerMovementLocked = lock
  }

  handleDamage(dir: Phaser.Math.Vector2) {
    if (this._health <= 0) return

    if (this.healthState === HealthState.DAMAGE) return

    --this._health

    if (this._health <= 0) {
      this.healthState = HealthState.DEAD
      this.anims.play(`idle-${this.selectedSkin}`);
      this.setVelocity(0, 0)
    } else {
      this.setVelocity(dir.x, dir.y)
      this.setTint(0xff0000)
      this.healthState = HealthState.DAMAGE
      this.damageTime = 0
    }
  }

  eat() {
    this._hunger += 1
    sceneEvents.emit(Events.PLAYER_HUNGER_CHANGED, this._hunger)
  }

  getHungry() {
    if (this._hunger <= 0) return
    this._hunger -= 1
    sceneEvents.emit(Events.PLAYER_HUNGER_CHANGED, this._hunger)
  }

  setChest(chest: Chest) {
    this.activeChest = chest
  }
}