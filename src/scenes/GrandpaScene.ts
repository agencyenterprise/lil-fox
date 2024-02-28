import { Skin } from "@/characters/Character"
import IntroductionCharacter from "@/characters/IntroductionCharacter"
import { createCharacterAnims } from "@/anims/CharacterAnims"
import { Events, sceneEvents } from "@/events/EventsCenter"
import { Singleton } from "@/utils/GlobalAccessSingleton"
import GameUI from "./GameUI"

export default class GrandpaScene extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  public character!: IntroductionCharacter
  private wallsLayer: Phaser.Tilemaps.TilemapLayer
  private furnituresLayer: Phaser.Tilemaps.TilemapLayer
  private spawnPoints: Map<string, Phaser.Geom.Point> = new Map()

  constructor() {
    super({
      key: "GrandpaScene",
      physics: {
        default: "matter",
        arcade: {
          gravity: { y: 0 },
          // debug: true
        },
      },
    })
  }

  preload() {
    this.loadSkinSpriteSheet(Skin.DEFAULT)
    this.loadSkinSpriteSheet(Skin.BLUE)
    this.loadSkinSpriteSheet(Skin.KUMAMON)
    this.loadSkinSpriteSheet(Skin.SUNGLASSES)

    this.cursors = this.input.keyboard?.createCursorKeys()!
  }

  create() {
    this.scene.run("game-ui")
    this.scene.launch("settings-ui")

    Singleton.getInstance().gameUi = this.scene.get("game-ui") as GameUI

    const map = this.make.tilemap({ key: "grandpa-home-map" })

    createCharacterAnims(this.anims)

    this.cameras.main.setBounds(-40, -50, 250, 400)

    this.createLayers(map)
    this.spawnCharacter(map)
    this.addColliders()
  }

  createLayers(map: Phaser.Tilemaps.Tilemap) {
    const tileset0 = map.addTilesetImage("CuteRPG_Interior_custom", "tiles4")
    const tileset1 = map.addTilesetImage("Interiors_free_16x16", "tiles5")

    map.createLayer("Floor", [tileset0!, tileset1!])!
    this.wallsLayer = map.createLayer("Walls", [tileset0!, tileset1!])!
    this.furnituresLayer = map.createLayer("Furnitures", [tileset0!, tileset1!])!
    map.createLayer("Objects", [tileset0!, tileset1!])!

    map.getObjectLayer("SpawnPoints")!.objects.forEach((spawnPoint) => {
      const x = spawnPoint.x
      const y = spawnPoint.y
      this.spawnPoints.set(spawnPoint.name, new Phaser.Geom.Point(x!, y!))
    })
  }

  spawnCharacter(map: Phaser.Tilemaps.Tilemap) {
    const characterSpawn = this.spawnPoints.get("Character")!
    this.character = new IntroductionCharacter(this, characterSpawn.x, characterSpawn.y, "character")

    this.character.setSize(this.character.width * 0.4, this.character.height * 0.4)
    this.physics.add.existing(this.character, false)
    this.add.existing(this.character)
    this.physics.world.enableBody(this.character, Phaser.Physics.Arcade.DYNAMIC_BODY)

    this.cameras.main.startFollow(this.character, true, 0.05, 0.05)
  }

  addColliders() {
    this.wallsLayer?.setCollisionByProperty({ collides: true })
    this.furnituresLayer?.setCollisionByProperty({ collides: true })

    this.physics.add.collider(this.character, this.wallsLayer)
    this.physics.add.collider(this.character, this.furnituresLayer)
  }

  update() {
    this.character.update(this.cursors)
  }

  loadSkinSpriteSheet(skinName: string) {
    this.load.spritesheet(`idle-${skinName}`, `/assets/animations/fox/${skinName}/lilfox_idle_strip8.png`, {
      frameWidth: 32,
      frameHeight: 32,
    })
    this.load.spritesheet(`crouch-${skinName}`, `/assets/animations/fox/${skinName}/lilfox_crouch_strip8.png`, {
      frameWidth: 32,
      frameHeight: 32,
    })
    this.load.spritesheet(`sit-${skinName}`, `/assets/animations/fox/${skinName}/lilfox_sit_strip8.png`, {
      frameWidth: 32,
      frameHeight: 32,
    })
    this.load.spritesheet(`sneak-${skinName}`, `/assets/animations/fox/${skinName}/lilfox_sneak_strip4.png`, {
      frameWidth: 32,
      frameHeight: 32,
    })
    this.load.spritesheet(`run-${skinName}`, `/assets/animations/fox/${skinName}/lilfox_run_strip4.png`, {
      frameWidth: 32,
      frameHeight: 32,
    })
    this.load.spritesheet(`walk-${skinName}`, `/assets/animations/fox/${skinName}/lilfox_walk_strip8.png`, {
      frameWidth: 32,
      frameHeight: 32,
    })
    this.load.spritesheet(`die-${skinName}`, `/assets/animations/fox/${skinName}/lilfox_die_strip8.png`, {
      frameWidth: 32,
      frameHeight: 32,
    })
    this.load.spritesheet(`hurt-${skinName}`, `/assets/animations/fox/${skinName}/lilfox_hurt_strip5.png`, {
      frameWidth: 32,
      frameHeight: 32,
    })
  }
}