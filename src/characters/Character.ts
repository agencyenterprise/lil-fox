import Chest from "@/items/Chest"
import Phaser from "phaser"
import { Events, sceneEvents } from "@/events/EventsCenter"
import { TILE_SIZE } from "@/utils/gridUtils"
import { getWonLevels } from "@/utils/localStorageUtils"
import { Singleton } from "@/utils/GlobalAccessSingleton"
import { SoundSingleton, SoundEffects } from "@/utils/SoundSingleton"
import Npc from "@/npcs/Npc"
import { Area } from "@/types/Area"
import Sign from "@/types/Sign"
import Interactable from "@/types/Interactable"

declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      character(
        x: number,
        y: number,
        texture: string,
        frame?: string | number,
      ): Character
    }
  }
}

export enum Skin {
  DEFAULT = "default",
  BLUE = "blue",
  FLASK = "flask",
  KUMAMON = "kumamon",
  SUNGLASSES = "sunglasses",
}

enum HealthState {
  IDLE,
  DAMAGE,
  DEAD,
}

export default class Character extends Phaser.Physics.Arcade.Sprite {
  private isTracking = false
  public selectedSkin: Skin = Skin.DEFAULT
  private healthState = HealthState.IDLE
  private damageTime = 0
  private isPlayerMovementLocked = false

  private _health = 5

  private activeChest?: Chest

  get health() {
    return this._health
  }

  set skin(skin: Skin) {
    this.selectedSkin = skin
  }

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number,
  ) {
    super(scene, x, y, texture, frame)

    this.anims.play(`idle-${this.selectedSkin}`)
    scene.physics.add.existing(this, false)

    sceneEvents.on(
      Events.LOCK_PLAYER_MOVEMENT,
      this.handleLockPlayerMovement,
      this,
    )
    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      sceneEvents.off(
        Events.LOCK_PLAYER_MOVEMENT,
        this.handleLockPlayerMovement,
        this,
      )
    })
  }

  protected preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta)

    switch (this.healthState) {
      case HealthState.IDLE:
        break

      case HealthState.DAMAGE:
        this.damageTime += delta
        if (this.damageTime >= 250) {
          this.healthState = HealthState.IDLE
          this.setTint(0xffffff)
          this.damageTime = 0
        }
        break
    }
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    const interactiveObjects = Singleton.getInstance().interactiveObjects
    const areas = Singleton.getInstance().areas

    if (!cursors) return
    const spaceJustDown = Phaser.Input.Keyboard.JustDown(cursors.space)

    if (this.healthState === HealthState.DEAD && spaceJustDown) {
      this.scene.scene.restart()
    }

    if (
      this.healthState === HealthState.DAMAGE ||
      this.healthState === HealthState.DEAD
    )
      return

    this.isCharacterInArea(areas)

    if (spaceJustDown) {
      const nearbyArea = new Phaser.Geom.Circle(this.x, this.y, TILE_SIZE)

      const nearbyObject = interactiveObjects.find((obj) => {
        return nearbyArea.contains(obj.x!, obj.y!)
      })

      if (nearbyObject) {
        this.interactWithObject(nearbyObject)
      }
    }

    if (this.isPlayerMovementLocked) {
      this.anims.play(`idle-${this.selectedSkin}`)
      this.setVelocity(0, 0)
      return
    }

    this.moveFox(cursors)
    if (this.isTracking) {
      Singleton.getInstance().addToPlayerTrack({ x: this.x, y: this.y })
    }
  }

  stepSound() {
    SoundSingleton.getInstance().playSoundEffect(SoundEffects.FOOTSTEPS1)
  }

  moveFox(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    const speed = 85

    const leftDown = cursors.left?.isDown
    const rightDown = cursors.right?.isDown
    const upDown = cursors.up?.isDown
    const downDown = cursors.down?.isDown

    if (rightDown && upDown) {
      this.anims.play(`run-${this.selectedSkin}`, true)
      this.setVelocity(speed / 1.65, -speed / 1.65)
      this.scaleX = 1
      this.body?.offset.setTo(8, 12)
      this.stepSound()
    } else if (rightDown && downDown) {
      this.anims.play(`run-${this.selectedSkin}`, true)
      this.setVelocity(speed / 1.65, speed / 1.65)
      this.scaleX = 1
      this.body?.offset.setTo(8, 12)
      this.stepSound()
    } else if (leftDown && upDown) {
      this.anims.play(`run-${this.selectedSkin}`, true)
      this.setVelocity(-speed / 1.65, -speed / 1.65)
      this.scaleX = -1
      this.body?.offset.setTo(24, 12)
      this.stepSound()
    } else if (leftDown && downDown) {
      this.anims.play(`run-${this.selectedSkin}`, true)
      this.setVelocity(-speed / 1.65, speed / 1.65)
      this.scaleX = -1
      this.body?.offset.setTo(24, 12)
      this.stepSound()
    } else if (leftDown) {
      this.anims.play(`run-${this.selectedSkin}`, true)
      this.setVelocity(-speed, 0)
      this.scaleX = -1
      this.body?.offset.setTo(24, 12)
      this.stepSound()
    } else if (rightDown) {
      this.anims.play(`run-${this.selectedSkin}`, true)
      this.setVelocity(speed, 0)
      this.scaleX = 1
      this.body?.offset.setTo(8, 12)
      this.stepSound()
    } else if (upDown) {
      this.anims.play(`run-${this.selectedSkin}`)
      this.setVelocity(0, -speed)
      this.stepSound()
    } else if (downDown) {
      this.anims.play(`run-${this.selectedSkin}`)
      this.setVelocity(0, speed)
      this.stepSound()
    } else {
      this.anims.play(`idle-${this.selectedSkin}`)
      this.setVelocity(0, 0)
    }
  }

  isCharacterInArea(areas: Area[]) {
    areas.forEach((area) => {
      if (area.contains(this.x, this.y)) {
        area.handleCharacterInArea(this)
      } else {
        area.handleCharacterNotInArea(this)
      }
    })
  }

  interactWithObject(object: Interactable) {
    object.handleInteraction(this)
    // if (object instanceof Npc) {
    //   object.handleInteraction(this)
    // } else if (object instanceof Sign) {
    //   object.handleInteraction()
    // } else {
    //   const wonLevels = getWonLevels()
    //   const props = object.properties
    //   const messages = props
    //     .find((p: any) => p.name === "message")
    //     ?.value.split(";")
    //   const isFinishLevelSign = props.find(
    //     (p: any) => p.name === "isFinishLevelSign",
    //   )?.value
    //   const levelNumber = props.find((p: any) => p.name === "levelNumber")
    //     ?.value

    //   if (isFinishLevelSign) {
    //     const correctAlternative = props.find(
    //       (p: any) => p.name === "correctAlternative",
    //     )?.value
    //     const levelNumber = props.find((p: any) => p.name === "levelNumber")
    //       ?.value

    //     if (wonLevels.includes(levelNumber)) {
    //       sceneEvents.emit(Events.SHOW_DIALOG, ["You already won this level!"])
    //     } else {
    //       this.scene.scene.pause("LilFox")
    //       this.scene.scene.launch("QuizScene", {
    //         messages,
    //         correctAlternative,
    //         levelNumber,
    //       })
    //     }
    //   } else {
    //     if (levelNumber && wonLevels.includes(levelNumber)) {
    //       sceneEvents.emit(Events.SHOW_DIALOG, ["You already won this level!"])
    //     } else {
    //       sceneEvents.emit(Events.SHOW_DIALOG, messages)
    //     }
    //   }
    // }
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
      this.anims.play(`idle-${this.selectedSkin}`)
      this.setVelocity(0, 0)
      sceneEvents.emit(Events.GAME_OVER)
    } else {
      this.setVelocity(dir.x, dir.y)
      this.setTint(0xff0000)
      this.healthState = HealthState.DAMAGE
      this.damageTime = 0

      SoundSingleton.getInstance().playSoundEffect(SoundEffects.DAMAGE)
    }
  }

  setChest(chest: Chest) {
    this.activeChest = chest
  }

  startTrackingPosition() {
    this.isTracking = true
  }
}
