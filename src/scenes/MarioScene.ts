import PlatformGameCharacter from "@/characters/PlatformGameCharacter";
import Slug from "@/enemies/Slug";
import { Events, sceneEvents } from "@/events/EventsCenter";

export default class MarioScene extends Phaser.Scene {

  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  public character!: PlatformGameCharacter
  private terrainLayer: Phaser.Tilemaps.TilemapLayer
  private waterLayer: Phaser.Tilemaps.TilemapLayer

  private coins: Phaser.GameObjects.Group
  private potions: Phaser.GameObjects.Group

  private slugs: Phaser.GameObjects.Group

  private collectedCoins: number = 0

  private countDownTimer: Phaser.Time.TimerEvent 

  constructor() {
    super({

      key: 'MarioScene',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 1700 },
          // debug: true
        },
      },
    })
  }


  preload() {
    this.cursors = this.input.keyboard?.createCursorKeys()!;
  }

  create() {
    const map = this.make.tilemap({ key: 'platform-level-map' });
    const tileset0 = map.addTilesetImage('nature-paltformer-tileset-16x16', 'tiles3');


    map.createLayer('Sky', tileset0!)!;
    this.waterLayer = map.createLayer('Water', tileset0!)!;
    this.terrainLayer = map.createLayer('Terrain', tileset0!)!;


    this.character = new PlatformGameCharacter(this, 30, 650, "character");

    this.character.setSize(this.character.width * 0.4, this.character.height * 0.4)
    this.physics.add.existing(this.character, false);
    this.add.existing(this.character);
    this.physics.world.enableBody(this.character, Phaser.Physics.Arcade.DYNAMIC_BODY)

    this.cameras.main.startFollow(this.character, true, 0.05, 0.05);
    this.cameras.main.setBounds(25, 500, 3392, 100)

    this.terrainLayer?.setCollisionByProperty({ collides: true });
    this.physics.add.collider(this.character, this.terrainLayer, this.handleTerrainCollision, () => this.character.isAlive, this);

    this.coins = this.add.group({
      classType: Phaser.GameObjects.Image,
      createCallback: (go) => {
        this.physics.world.enable(go);
        (go as any).body.allowGravity = false;
      }
    })

    map.getObjectLayer('Coins')!.objects.forEach(coin => {
      this.add.tween({
        yoyo: true,
        delay: 0,
        duration: 300,
        repeat: -1,
        y: {
          from: coin.y,
          start: coin.y,
          to: coin.y! - 1,
        },
        targets: this.coins.get(coin.x, coin.y, 'coin').setOrigin(0, 1),
      })
    })

    this.potions = this.add.group({
      classType: Phaser.GameObjects.Image,
      createCallback: (go) => {
        this.physics.world.enable(go);
        (go as any).body.allowGravity = false;
      }
    })

    map.getObjectLayer('Potions')!.objects.forEach(potion => {
      this.potions.get(potion.x!, potion.y!, potion.name).setOrigin(0, 1)
    })

    this.slugs = this.add.group({
      classType: Slug,
      createCallback: (go) => {
        this.physics.world.enable(go);
        (go as any).body.allowGravity = false;
      }
    })

    map.getObjectLayer('Enemies')!.objects.forEach(enemy => {
      this.slugs.get(enemy.x!, enemy.y!, enemy.name).setOrigin(0, 1)
    })
    this.physics.add.collider(this.character, this.slugs, this.handleCharacterSlugCollision, () => this.character.isAlive, this);


    const hearts = this.add.group({
      classType: Phaser.GameObjects.Image,
    })
  
    hearts.createMultiple({
      key: 'ui-heart-full',
      setXY: {
        x: 20,
        y: 10,
        stepX: 16
      },
      quantity: 7
    })

    this.countDownTimer = this.time.addEvent({ delay: 1000, callback: this.updateTimer, callbackScope: this, repeat: 10 });
  }

  update() {
    this.character.update(this.cursors)
    this.physics.overlap(this.character, this.coins, this.handleCollectCoin, undefined, this)
    this.physics.overlap(this.character, this.potions, this.handleCollectPotion, undefined, this)
  }

  handleCollectCoin(character: any, coin: any) {
    coin.destroy()
    this.collectedCoins++
    sceneEvents.emit(Events.PLAYER_COLLECTED_COIN, this.collectedCoins)
  }

  handleCollectPotion(character: any, potion: any) {
    potion.destroy()
    character.drinkPotion(potion.texture.key)
  }

  handleTerrainCollision() {
    this.character.isJumping = false
  }

  handleCharacterSlugCollision(obj: any, obj2: any) {
    this.countDownTimer.remove()
    this.character.die()
  }

  updateTimer() {

    sceneEvents.emit(Events.UPDATE_COUNTDOWN_TIMER, this.countDownTimer.getRepeatCount())
    if (this.countDownTimer.getRepeatCount() === 0) {
      this.countDownTimer.remove()
      this.character.die()
    }
  }
}
