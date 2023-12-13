import { createLizardAnims } from "@/anims/EnemyAnims";
import { createCharacterAnims } from "@/anims/CharacterAnims";
import { createChestAnims } from "@/anims/TreasureAnims";
import Lizard from "@/enemies/Lizard";
import Character from "@/characters/Character";
import { sceneEvents } from "@/events/EventsCenter";


export class FoxGame extends Phaser.Scene {
  constructor() {
    super('LilFox')
  }

  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private character!: Character
  
  private playerLizardsCollider?: Phaser.Physics.Arcade.Collider
  
  preload() {
    this.load.spritesheet(
      "idle-default",
      "/assets/animations/fox/default/lilfox_idle_strip8.png",
      {
        frameWidth: 32,
        frameHeight: 32,
      }
    );
    this.load.spritesheet(
      "crouch-default",
      "/assets/animations/fox/default/lilfox_crouch_strip8.png",
      { frameWidth: 32, frameHeight: 32 }
    );
    this.load.spritesheet(
      "sit-default",
      "/assets/animations/fox/default/lilfox_sit_strip8.png",
      {
        frameWidth: 32,
        frameHeight: 32,
      }
    );
    this.load.spritesheet(
      "sneak-default",
      "/assets/animations/fox/default/lilfox_sneak_strip4.png",
      { frameWidth: 32, frameHeight: 32 }
    );
    this.load.spritesheet(
      "run-default",
      "/assets/animations/fox/default/lilfox_run_strip4.png",
      {
        frameWidth: 32,
        frameHeight: 32,
      }
    );
    this.load.spritesheet(
      "walk-default",
      "/assets/animations/fox/default/lilfox_walk_strip8.png",
      {
        frameWidth: 32,
        frameHeight: 32,
      }
    );

    this.cursors = this.input.keyboard?.createCursorKeys();

  }

  create() {
    this.scene.run('game-ui')

    createCharacterAnims(this.anims)
    createLizardAnims(this.anims)
    createChestAnims(this.anims)

    const map = this.make.tilemap({ key: 'map' });
    const tileset1 = map.addTilesetImage('Tileset 1', 'tiles1');
    const tileset2 = map.addTilesetImage('DungeonTileset', 'tiles2');

    map.createLayer('Terrain', tileset1!);
    map.createLayer('Treasures', tileset2!);
    const objectsLayer = map.createLayer('Objects', tileset1!);
    
    objectsLayer?.setCollisionByProperty({ colides: true });

    const chests = this.physics.add.staticGroup()
    const chestsLayer = map.getObjectLayer('Treasures')
    chestsLayer?.objects.forEach(chestObj => {
      chests.get(chestObj.x! + chestObj.width! * 0.5, chestObj.y! + chestObj.height! * 0.5, 'treasure', 'chest_empty_open_anim_f0.png')
    })


    // const debugGraphics = this.add.graphics().setAlpha(0.75);
    // objectsLayer?.renderDebug(debugGraphics, {
    //   tileColor: null,
    //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
    //   faceColor: new Phaser.Display.Color(40, 39, 37, 255)
    // });


    this.character = new Character(this, 920, 920, "character");
    this.character.setSize(this.character.width * 0.5, this.character.height * 0.8)
    this.physics.add.existing(this.character, false);
    this.add.existing(this.character);
    this.physics.world.enableBody(this.character, Phaser.Physics.Arcade.DYNAMIC_BODY)


    if (objectsLayer === null) return

    this.cameras.main.startFollow(this.character, true, 0.05, 0.05);

    const lizards = this.physics.add.group({
      classType: Lizard,
      createCallback: (go) => {
        const lizGo = go as Lizard
        if (!lizGo.body) return
        lizGo.body.onCollide = true
      }
    })

    lizards.get(950, 950, 'lizard')

    this.physics.add.collider(this.character, objectsLayer);
    this.physics.add.collider(lizards, objectsLayer);
    this.physics.add.collider(this.character, chests)
    this.physics.add.collider(lizards, chests)

    this.playerLizardsCollider = this.physics.add.collider(lizards, this.character, this.handleCharacterLizardCollision, undefined, this);
  }

  private handleCharacterLizardCollision(
    obj1: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
    obj2: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile
  ) {
    const lizard = obj2 as Lizard
    const dx = this.character.x - lizard.x
    const dy = this.character.y - lizard.y

    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(150)
  
    this.character.handleDamage(dir)

    sceneEvents.emit('player-health-changed', this.character.health)

    if (this.character.health <= 0) {
      this.playerLizardsCollider?.destroy()
    }
  }

  update(t: number, dt: number) {
    this.character.update(this.cursors)
  }
}
