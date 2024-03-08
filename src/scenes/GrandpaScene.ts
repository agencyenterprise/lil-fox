import { Skin } from "@/characters/Character"
import IntroductionCharacter from "@/characters/IntroductionCharacter"
import { createCharacterAnims } from "@/anims/CharacterAnims"

import { Area } from "@/types/Area"
import { TipArea } from "@/types/TipArea"
import { GrandpaDoorArea } from "@/types/GrandpaDoorArea"
import { GrandpaLetter } from "@/types/GrandpaLetter"
import { GrandpaCollectible } from "@/types/GrandpaCollectible"

import { Events, sceneEvents } from "@/events/EventsCenter"
import { Singleton } from "@/utils/GlobalAccessSingleton"
import { SoundEffects, SoundSingleton } from "@/utils/SoundSingleton"

import GameUI from "./GameUI"

const enum Collectibles {
  Letter = "Letter",
  Map = "Map",
  Pouch = "Pouch",
  Backpack = "Backpack",
}

const letterText = `Dear Lil Fox, 

I hope this letter finds you well.
It brings me great joy to know that you have decided to embark on this journey to preserve the culture of our island tribes with a time capsule. 

Although I couldn’t be around to send you on this journey, - I have left you a map, my old backpack and some coins to help you along the way.
My friend Joe at the town general store will help you with some supplies. 

Remember that the true essence of this journey lies not only in the artifacts you collect, but in the people you meet and the stories you uncover along the way. 
Adventure awaits - have a great one!

Love, 
Grandpa

Ps. Follow the path towards the forest.`

const pouchCoinsCount = 100

export default class GrandpaScene extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private map: Phaser.Tilemaps.Tilemap
  public character!: IntroductionCharacter
  private wallsLayer: Phaser.Tilemaps.TilemapLayer
  private furnituresLayer: Phaser.Tilemaps.TilemapLayer
  private spawnPoints: Map<string, Phaser.Geom.Point> = new Map()
  private doorImage: Phaser.GameObjects.Image
  private doorCollider: Phaser.Physics.Arcade.Collider
  private letterImage: Phaser.GameObjects.Image
  private letterOpenImage: Phaser.GameObjects.Image
  private letterOpenText: Phaser.GameObjects.Text
  private mapImage: Phaser.GameObjects.Image
  private pouchImage: Phaser.GameObjects.Image
  private backpackImage: Phaser.GameObjects.Image
  private itemsLeftToCollect: string[] = [Collectibles.Letter]

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
      cameras: {
        name: "main",
        zoom: 3,
        roundPixels: true,
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

    this.map = this.make.tilemap({ key: "grandpa-home-map" })

    createCharacterAnims(this.anims)

    this.cameras.main.setBounds(-40, -50, 250, 400)

    this.createLayers()
    this.createAreas()
    this.createObjects()
    this.createInteractions()
    this.spawnCharacter()
    this.addColliders()
    this.createEventListeners()
  }

  createLayers() {
    const tileset0 = this.map.addTilesetImage("CuteRPG_Interior_custom", "tiles4")
    const tileset1 = this.map.addTilesetImage("Interiors_free_16x16", "tiles5")

    this.map.createLayer("Floor", [tileset0!, tileset1!])!
    this.wallsLayer = this.map.createLayer("Walls", [tileset0!, tileset1!])!
    this.furnituresLayer = this.map.createLayer("Furnitures", [tileset0!, tileset1!])!
    this.map.createLayer("Objects", [tileset0!, tileset1!])!

    this.map.getObjectLayer("SpawnPoints")!.objects.forEach((spawnPoint) => {
      const x = spawnPoint.x
      const y = spawnPoint.y
      this.spawnPoints.set(spawnPoint.name, new Phaser.Geom.Point(x!, y!))
    })
  }

  createAreas() {
    Singleton.getInstance().areas = this.map.getObjectLayer("Areas")!.objects.map((area) => {
      if (this.itemsLeftToCollect.includes(area.name.replace("tip", ""))) {
        return new TipArea(area.x!, area.y!, area.width!, area.height!)
      } else if (area.name == "areaDoor") {
        return new GrandpaDoorArea(this, area.x!, area.y!, area.width!, area.height!)
      } else {
        return new Area(area.x!, area.y!, area.width!, area.height!)
      }
    })
  }

  createObjects() {
    const doorSpawn = this.spawnPoints.get("Door")!
    this.doorImage = this.add.image(doorSpawn.x, doorSpawn.y, "door")
    this.physics.world.enableBody(this.doorImage, Phaser.Physics.Arcade.STATIC_BODY)

    const letterSpawn = this.spawnPoints.get(Collectibles.Letter)!
    this.letterImage = this.add.image(letterSpawn.x, letterSpawn.y, "letter").setScale(0.7)
    this.physics.world.enableBody(this.letterImage, Phaser.Physics.Arcade.STATIC_BODY)
    this.addTween(this.letterImage, letterSpawn)

    this.letterOpenImage = this.add
      .image(letterSpawn.x, letterSpawn.y + 36, "letterOpen")
      .setScale(0.6)
      .setDepth(10)
      .setVisible(false)
    this.letterOpenText = this.add
      .text(this.letterOpenImage.x - 85, this.letterOpenImage.y - 120, letterText, {
        fontSize: "8px",
        color: "black",
        wordWrap: { width: 180 },
      })
      .setVisible(false)
      .setDepth(10)

    this.mapImage = this.createCollectible(Collectibles.Map, "map", 0.8)
    this.pouchImage = this.createCollectible(Collectibles.Pouch, "pouch", 0.8)
    this.backpackImage = this.createCollectible(Collectibles.Backpack, "backpack", 0.7)
  }

  createCollectible(item: Collectibles, imageKey: string, scale: number) {
    const spawn = this.spawnPoints.get(item)!
    const image = this.add.image(spawn.x, spawn.y, imageKey).setVisible(false).setScale(scale)
    this.physics.world.enableBody(image, Phaser.Physics.Arcade.STATIC_BODY)
    this.addTween(image, spawn)

    return image
  }

  addTween(image: Phaser.GameObjects.Image, spawn: Phaser.Geom.Point) {
    this.add.tween({
      yoyo: true,
      delay: 0,
      duration: 300,
      repeat: -1,
      y: {
        from: spawn.y,
        start: spawn.y,
        to: spawn.y - 2,
      },
      targets: image,
    })
  }

  createInteractions() {
    this.map.getObjectLayer("Areas")!.objects.map((area) => {
      if (area.name === "tipLetter") {
        Singleton.getInstance().interactiveObjects.push(new GrandpaLetter(this, area.x!, area.y!))
      }

      if (area.name === "tipMap") {
        Singleton.getInstance().interactiveObjects.push(
          new GrandpaCollectible(
            this,
            area.x!,
            area.y!,
            "This is the map of the game, keep with you always.",
            Events.GRANDPA_MAP_COLLECTED,
          ),
        )
      }

      if (area.name === "tipPouch") {
        Singleton.getInstance().interactiveObjects.push(
          new GrandpaCollectible(
            this,
            area.x!,
            area.y!,
            "Get this pouch of coins, it will help you in the game.",
            Events.GRANDPA_POUCH_COLLECTED,
          ),
        )
      }

      if (area.name === "tipBackpack") {
        Singleton.getInstance().interactiveObjects.push(
          new GrandpaCollectible(
            this,
            area.x!,
            area.y!,
            "Get this backpack, it will help you in the game.",
            Events.GRANDPA_BACKPACK_COLLECTED,
          ),
        )
      }
    })
  }

  spawnCharacter() {
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

    this.doorCollider = this.physics.add.collider(this.character, this.doorImage)
    this.physics.add.collider(this.character, this.letterImage)
    this.physics.add.collider(this.character, this.mapImage)
    this.physics.add.collider(this.character, this.pouchImage)
    this.physics.add.collider(this.character, this.backpackImage)
  }

  createEventListeners() {
    sceneEvents.on(Events.GRANDPA_LETTER_OPEN, this.handleLetterOpen, this)
    sceneEvents.on(Events.GRANDPA_LETTER_READ, this.handleLetterRead, this)

    sceneEvents.on(
      Events.GRANDPA_MAP_COLLECTED,
      () => this.handleItemCollected(Collectibles.Map, this.mapImage, SoundEffects.PICKUP_PAPER),
      this,
    )
    sceneEvents.on(
      Events.GRANDPA_POUCH_COLLECTED,
      () => {
        Singleton.getInstance().gameUi.handlePlayerCollectedCoin(pouchCoinsCount)
        this.handleItemCollected(Collectibles.Pouch, this.pouchImage, SoundEffects.PICKUP_COIN)
      },
      this,
    )
    sceneEvents.on(
      Events.GRANDPA_BACKPACK_COLLECTED,
      () => this.handleItemCollected(Collectibles.Backpack, this.backpackImage, SoundEffects.PICKUP_PAPER),
      this,
    )

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      sceneEvents.removeAllListeners(Events.GRANDPA_LETTER_OPEN)
      sceneEvents.removeAllListeners(Events.GRANDPA_LETTER_READ)
      sceneEvents.removeAllListeners(Events.GRANDPA_MAP_COLLECTED)
      sceneEvents.removeAllListeners(Events.GRANDPA_POUCH_COLLECTED)
      sceneEvents.removeAllListeners(Events.GRANDPA_BACKPACK_COLLECTED)
    })
  }

  handleLetterOpen() {
    if (this.letterImage.visible) {
      this.removeItemCollected(Collectibles.Letter)
      this.letterOpenImage.setVisible(true)
      this.letterOpenText.setVisible(true)
    }
  }

  handleLetterRead() {
    if (this.letterImage.visible) {
      SoundSingleton.getInstance().playSoundEffect(SoundEffects.PICKUP_PAPER)
      this.letterOpenImage.setVisible(false)
      this.letterOpenText.setVisible(false)
      this.letterImage.setVisible(false)

      this.mapImage.setVisible(true)
      this.pouchImage.setVisible(true)
      this.backpackImage.setVisible(true)

      this.itemsLeftToCollect.push(Collectibles.Map)
      this.itemsLeftToCollect.push(Collectibles.Pouch)
      this.itemsLeftToCollect.push(Collectibles.Backpack)
      this.createAreas()
    }
  }

  handleItemCollected(item: Collectibles, image: Phaser.GameObjects.Image, soundEffect: SoundEffects) {
    if (image.visible) {
      SoundSingleton.getInstance().playSoundEffect(soundEffect)
      this.removeItemCollected(item)
      image.setVisible(false)
      this.handleDoorOpen()
    }
  }

  removeItemCollected(itemName: string) {
    this.itemsLeftToCollect = this.itemsLeftToCollect.filter((item) => item !== itemName)
    this.createAreas()
  }

  handleDoorOpen() {
    if (this.doorImage.visible) {
      if (this.itemsLeftToCollect.length > 0) {
        return
      }

      SoundSingleton.getInstance().playSoundEffect(SoundEffects.DOOR_OPEN)
      this.doorImage.setVisible(false)
      this.doorCollider.destroy()
    }
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
