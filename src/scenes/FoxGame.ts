import { createLizardAnims } from "@/anims/EnemyAnims";
import { createCharacterAnims } from "@/anims/CharacterAnims";
import Lizard from "@/enemies/Lizard";
import Character from "@/characters/Character";
export class FoxGame extends Phaser.Scene {
  constructor() {
    super('LilFox')
  }

  private cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined
  private character: Character
  private hit = 0

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
    createCharacterAnims(this.anims)
    createLizardAnims(this.anims)

    const map = this.make.tilemap({ key: 'map' });
    const tileset1 = map.addTilesetImage('Tileset 1', 'tiles1');

    if (tileset1 === null) return
    map.createLayer('Terrain', tileset1);
    const objectsLayer = map.createLayer('Objects', tileset1);

    objectsLayer?.setCollisionByProperty({ colides: true });

    const debugGraphics = this.add.graphics().setAlpha(0.75);
    objectsLayer?.renderDebug(debugGraphics, {
      tileColor: null,
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
      faceColor: new Phaser.Display.Color(40, 39, 37, 255)
    });
    
    this.character = new Character(this, 100, 100, "character");
    this.add.existing(this.character);


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

    lizards.get(256, 128, 'lizard')

    this.physics.add.collider(this.character, objectsLayer);
    this.physics.add.collider(lizards, objectsLayer);

    this.physics.add.collider(lizards, this.character, this.handleCharacterLizardCollision, undefined, this);
  }

  private handleCharacterLizardCollision(
    obj1: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
    obj2: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile
  ) {
    const lizard = obj2 as Lizard
    const dx = this.character.x - lizard.x
    const dy = this.character.y - lizard.y  

    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200)
  
    this.character.setVelocity(dir.x, dir.y)

    this.hit = 1
  }

  update(t: number, dt: number) {
    if (!this.cursors || !this.character) return;
  
    if (this.hit > 0) {
      ++this.hit
      if (this.hit > 10) {
        this.hit = 0
      }
      return
    }

    this.character.update(this.cursors)
  }
}
