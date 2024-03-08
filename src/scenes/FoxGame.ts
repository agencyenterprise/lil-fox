import { createEnemyAnims } from "@/anims/EnemyAnims"
import { createCharacterAnims } from "@/anims/CharacterAnims"
import { createChestAnims } from "@/anims/TreasureAnims"
import Lizard from "@/enemies/Lizard"
import Character, { Skin } from "@/characters/Character"
import { Events, sceneEvents } from "@/events/EventsCenter"
import Chest from "@/items/Chest"
import GreenArcher from "@/enemies/GreenArcher"
import { createArcherAnims } from "@/anims/GreenArcherAnims"
import { Dialog } from "@/ui/Dialog"
import { getWonLevels } from "@/utils/localStorageUtils"
import Cat from "@/npcs/Cat"
import { createCatAnims, createCatOwnerAnims, createHumanInBlueAnims } from "@/anims/NpcAnims"
import { SpawnPoints } from "@/types/SpawnPoints"
import CatOwner from "@/npcs/CatOwner"
import { Singleton } from "@/utils/GlobalAccessSingleton"
import { TipArea } from "@/types/TipArea"
import { Area } from "@/types/Area"
import { CatArea } from "@/types/CatArea"
import HumanInBlue from "@/npcs/HumanInBlue"
import { SoundArea } from "@/types/SoundArea"
import GameUI from "./GameUI"
import Sign from "@/types/Sign"
import EnterLevelSign from "@/types/EnterLevelSign"
import { SignType, createSign } from "@/factory/SignFactory"
import initializeWorld from "@/InitializeWorld"
import { getItems } from "@/prefabs/Item"

type CreateData = {
  levelNumber?: number
}

export default class FoxGame extends Phaser.Scene {
  constructor() {
    super({
      key: "LilFox",
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

  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  character!: Character

  private terrainLayer: Phaser.Tilemaps.TilemapLayer
  private constructionsLayer: Phaser.Tilemaps.TilemapLayer
  private treesLayer: Phaser.Tilemaps.TilemapLayer
  private treasuresLayer: Phaser.Tilemaps.TilemapLayer
  private objectsLayer: Phaser.Tilemaps.TilemapLayer

  private signsObjects: Phaser.Tilemaps.ObjectLayer
  private npcsObjects: Phaser.Tilemaps.ObjectLayer
  private areasObjects: Phaser.Tilemaps.ObjectLayer
  private blueberryObjects: Phaser.Tilemaps.ObjectLayer

  private areas: Area[]

  private spawnPoints: Map<string, Phaser.Geom.Point> = new Map()

  private foods: Phaser.GameObjects.Group
  private lizards: Phaser.GameObjects.Group
  private greenArchers: Phaser.GameObjects.Group
  private cats: Phaser.GameObjects.Group
  private catOwners: Phaser.GameObjects.Group
  private humansInBlue: Phaser.GameObjects.Group
  private arrows: Phaser.GameObjects.Group

  private playerLizardsCollider?: Phaser.Physics.Arcade.Collider
  private playerArrowsCollider?: Phaser.Physics.Arcade.Collider

  private dialogUi: Dialog

  private currentLevel: number = 0
  private collectedBlueBerries: number = 0

  preload() {
    this.cursors = this.input.keyboard?.createCursorKeys()!
  }

  create(data: CreateData) {
    createArcherAnims(this.anims)
    createEnemyAnims(this.anims)
    createChestAnims(this.anims)
    createCatAnims(this.anims)
    createCatOwnerAnims(this.anims)
    createHumanInBlueAnims(this.anims)

    const map = this.make.tilemap({ key: "map" })
    this.createLayers(map)

    this.spawnCharacter(map, data)
    this.spawnEnemies(map)
    this.spawnNpcs(map)

    this.signsObjects.objects.forEach((s) => {
      const sign = createSign(s.x!, s.y!, s.name as SignType)
      Singleton.getInstance().interactiveObjects.push(sign)
    })

    this.addColliders()
    this.createBlueberries(map)
    this.createEventListeners()

    const globalAccessSingleton = Singleton.getInstance()
    globalAccessSingleton.areas = this.areas


    // const debugGraphics = this.add.graphics().setAlpha(0.75);
    // this.treesLayer?.renderDebug(debugGraphics, {
    //   tileColor: null,
    //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
    //   faceColor: new Phaser.Display.Color(40, 39, 37, 255)
    // });
    // this.terrainLayer?.renderDebug(debugGraphics, {
    //   tileColor: null,
    //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
    //   faceColor: new Phaser.Display.Color(40, 39,1 37, 255)
    // });
  }

  spawnNpcs(map: Phaser.Tilemaps.Tilemap) {
    this.cats = this.physics.add.group({
      classType: Cat,
    })

    this.catOwners = this.physics.add.group({
      classType: CatOwner,
    })

    this.humansInBlue = this.physics.add.group({
      classType: HumanInBlue,
    })

    this.npcsObjects.objects.forEach((npc) => {
      const x = npc.x! + npc.width! * 0.5
      const y = npc.y! + npc.height! * 0.5
      const props = npc.properties
      const messages = props.find((p: any) => p.name === "message")?.value.split(";")
      switch (npc.name) {
        case "cat":
          const cat: Cat = this.cats.get(x, y, "cat")
          cat.setVisible(false)
          cat.setMessages(messages)
          Singleton.getInstance().cat = cat
          Singleton.getInstance().interactiveObjects.push(cat)
          break
        case "cat_owner":
          const catOwner: CatOwner = this.catOwners.get(x, y, "cat_owner")
          catOwner.setMessages(messages)
          Singleton.getInstance().catOwner = catOwner
          Singleton.getInstance().interactiveObjects.push(catOwner)
          break
        case "human_in_blue":
          const humanInBlue: HumanInBlue = this.humansInBlue.get(x, y, "human_in_blue")
          Singleton.getInstance().interactiveObjects.push(humanInBlue)
      }
    })
  }

  spawnEnemies(map: Phaser.Tilemaps.Tilemap) {
    this.lizards = this.physics.add.group({
      classType: Lizard,
      createCallback: (go) => {
        const lizGo = go as Lizard
        if (!lizGo.body) return
        lizGo.body.onCollide = true
        lizGo.setDepth(2)
      },
    })

    this.greenArchers = this.physics.add.group({
      classType: GreenArcher,
    })
    this.arrows = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
    })

    map.getObjectLayer("Enemies")!.objects.forEach((enemy) => {
      const wonLevels = getWonLevels()
      const x = enemy.x! + enemy.width! * 0.5
      const y = enemy.y! + enemy.height! * 0.5
      switch (enemy.name) {
        case "lizard":
          if (wonLevels.includes(1)) break
          this.lizards.get(x, y, "lizard")
          break
        case "green_archer":
          if (wonLevels.includes(2)) break
          const props = enemy.properties
          const facingDirection = props.find((p: any) => p.name === "facing")?.value.split(";")[0]
          this.greenArchers.get(x, y, "greenArcher").setArrows(this.arrows).setFacingDirection(facingDirection)
          break
      }
    })
  }

  spawnCharacter(map: Phaser.Tilemaps.Tilemap, data: CreateData) {
    map.getObjectLayer("SpawnPoints")!.objects.forEach((spawnPoint) => {
      const x = spawnPoint.x
      const y = spawnPoint.y
      this.spawnPoints.set(spawnPoint.name, new Phaser.Geom.Point(x!, y!))
    })

    if (data.levelNumber) {
      const levelSpawn = this.spawnPoints.get(`level${data.levelNumber}Spawn`)!
      this.character = new Character(this, levelSpawn.x, levelSpawn.y, "character")
    } else {
      const mainSpawn = this.spawnPoints.get(SpawnPoints.MAIN_SPAWN)!
      this.character = new Character(this, mainSpawn.x, mainSpawn.y, "character")
    }

    this.character.setSize(this.character.width * 0.4, this.character.height * 0.4)
    this.physics.add.existing(this.character, false)
    this.add.existing(this.character)
    this.physics.world.enableBody(this.character, Phaser.Physics.Arcade.DYNAMIC_BODY)

    this.cameras.main.startFollow(this.character, true, 0.05, 0.05)
  }

  createBlueberries(map: Phaser.Tilemaps.Tilemap) {
    this.foods = this.add.group({
      classType: Phaser.GameObjects.Image,
      createCallback: (go) => {
        this.physics.world.enable(go)
      },
    })

    this.physics.add.collider(this.character, this.foods, this.handleCollectFood, undefined, this)

    map.getObjectLayer("Blueberries")!.objects.forEach((blueberry) => {
      const x = blueberry.x! + blueberry.width! * 0.5
      const y = blueberry.y! + blueberry.height! * 0.5

      this.add.tween({
        yoyo: true,
        delay: 0,
        duration: 300,
        repeat: -1,
        y: {
          from: y,
          start: y,
          to: y - 2,
        },
        targets: this.foods.get(x, y, "berry"),
      })
    })
  }

  private handleCollectFood(obj1: any, obj2: any) {
    const food = obj2 as Phaser.GameObjects.Image
    food.destroy()

    if (this.collectedBlueBerries >= 5) return

    this.collectedBlueBerries += 1
    sceneEvents.emit(Events.PLAYER_COLLECTED_BERRY, this.collectedBlueBerries)
  }

  private handleCharacterChestCollision(
    obj1: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
    obj2: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
  ) {
    const chest = obj2 as Chest
    this.character.setChest(chest)
  }

  private handleCharacterLizardCollision(
    obj1: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
    obj2: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
  ) {
    const lizard = obj2 as Lizard
    const dx = this.character.x - lizard.x
    const dy = this.character.y - lizard.y

    lizard.changeDirection(lizard)

    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(150)

    this.character.handleDamage(dir)

    sceneEvents.emit(Events.PLAYER_HEALTH_CHANGED, this.character.health)

    if (this.character.health <= 0) {
      this.playerLizardsCollider?.destroy()
      this.playerArrowsCollider?.destroy()
    }
  }

  private handleCharacterArrowCollision(
    obj1: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
    obj2: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
  ) {
    const arrow = obj2 as Phaser.Physics.Arcade.Image
    const dx = this.character.x - arrow.x
    const dy = this.character.y - arrow.y

    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(150)

    this.character.handleDamage(dir)

    sceneEvents.emit(Events.PLAYER_HEALTH_CHANGED, this.character.health)

    if (this.character.health <= 0) {
      this.playerLizardsCollider?.destroy()
      this.playerArrowsCollider?.destroy()
    }

    arrow.destroy()
  }

  private handleObjectsArrowCollision(
    obj1: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
    obj2: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
  ) {
    const arrow = obj1 as Phaser.Physics.Arcade.Image
    arrow.destroy()
  }

  update(t: number, dt: number) {
    this.character.update(this.cursors)
    Singleton.getInstance().cat.update()
  }

  createLayers(map: Phaser.Tilemaps.Tilemap) {
    const tileset0 = map.addTilesetImage("punyworld-overworld-tileset", "tiles0")
    const tileset1 = map.addTilesetImage("Tileset 1", "tiles1")
    const tileset2 = map.addTilesetImage("DungeonTileset", "tiles2")

    this.terrainLayer = map.createLayer("Terrain", tileset0!)!
    this.treesLayer = map.createLayer("Trees", tileset0!)!
    this.constructionsLayer = map.createLayer("Constructions", tileset0!)!
    // this.treasuresLayer = map.createLayer('Treasures', tileset2!)!;

    this.signsObjects = map.getObjectLayer("Signs")!
    this.npcsObjects = map.getObjectLayer("Npcs")!
    this.areasObjects = map.getObjectLayer("Area")!

    const chests = this.physics.add.staticGroup({
      classType: Chest,
    })
    const chestsLayer = map.getObjectLayer("Treasures")
    chestsLayer?.objects.forEach((chestObj) => {
      chests.get(chestObj.x! + chestObj.width! * 0.5, chestObj.y! + chestObj.height! * 0.5, "treasure")
    })

    this.areas = this.areasObjects.objects.map((area) => {
      if (area.name.startsWith("tip")) {
        return new TipArea(area.x!, area.y!, area.width!, area.height!)
      } else if (area.name.startsWith("cat")) {
        return new CatArea(area.x!, area.y!, area.width!, area.height!)
      } else if (area.name.startsWith("sound")) {
        return new SoundArea(area.name, area.x!, area.y!, area.width!, area.height!)
      } else {
        return new Area(area.x!, area.y!, area.width!, area.height!)
      }
    })
  }

  addColliders() {
    this.treesLayer?.setCollisionByProperty({ collides: true })
    this.constructionsLayer?.setCollisionByProperty({ collides: true })
    this.terrainLayer?.setCollisionByProperty({ collides: true })

    this.physics.add.collider(this.character, this.terrainLayer)
    this.physics.add.collider(this.lizards, this.terrainLayer)
    this.physics.add.collider(this.character, this.treesLayer)
    this.physics.add.collider(this.lizards, this.treesLayer)
    this.physics.add.collider(this.character, this.constructionsLayer)
    this.physics.add.collider(this.lizards, this.constructionsLayer)
    this.physics.add.collider(this.character, this.objectsLayer)
    this.physics.add.collider(this.lizards, this.objectsLayer)

    // this.physics.add.collider(this.character, chests, this.handleCharacterChestCollision, undefined, this)
    // this.physics.add.collider(this.lizards, chests)

    // this.physics.add.collider(this.catOwners, this.character);-
    this.playerLizardsCollider = this.physics.add.collider(
      this.lizards,
      this.character,
      this.handleCharacterLizardCollision,
      undefined,
      this,
    )
    this.playerArrowsCollider = this.physics.add.collider(
      this.arrows,
      this.character,
      this.handleCharacterArrowCollision,
      undefined,
      this,
    )
    this.physics.add.collider(this.arrows, this.treesLayer, this.handleObjectsArrowCollision, undefined, this)
    this.physics.add.collider(this.arrows, this.constructionsLayer, this.handleObjectsArrowCollision, undefined, this)
  }

  changeSkin(skin: Skin) {
    this.character.skin = skin
  }

  createEventListeners() {
    sceneEvents.on(Events.WON_LEVEL_1, this.handleWinLevel1, this)
    sceneEvents.on(Events.WON_LEVEL_2, this.handleWinLevel2, this)

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      sceneEvents.off(Events.WON_LEVEL_1, this.handleWinLevel1, this)
      sceneEvents.off(Events.WON_LEVEL_2, this.handleWinLevel2, this)
    })
  }

  handleWinLevel1() {
    this.currentLevel = 1
    this.lizards.clear(true, true)
    const wonLevels = getWonLevels()
    localStorage.setItem("wonLevels", JSON.stringify([...wonLevels, 1]))
    this.showGetNftDiv()
  }

  handleWinLevel2() {
    this.currentLevel = 2
    this.greenArchers.clear(true, true)
    const wonLevels = getWonLevels()
    localStorage.setItem("wonLevels", JSON.stringify([...wonLevels, 2]))
    this.showGetNftDiv()
  }

  showGetNftDiv() {
    const sendNftDiv = document.getElementById("GetNFT")!
    sendNftDiv.style.display = "block"
  }

  getCurrentLevel() {
    return this.currentLevel
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
