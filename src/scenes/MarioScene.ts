import Character from "@/characters/Character";

export default class MarioScene extends Phaser.Scene {

  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  public character!: Character
  private terrainLayer: Phaser.Tilemaps.TilemapLayer


  constructor() {
    super({

      key: 'MarioScene',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 1000 },
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
    const tileset0 = map.addTilesetImage('tilemap', 'tiles3');

    
    this.terrainLayer = map.createLayer('Terrain', tileset0!)!;




    this.character = new Character(this, 30, 228, "character");
    this.character.marioLike = true

    this.character.setSize(this.character.width * 0.4, this.character.height * 0.4)
    this.physics.add.existing(this.character, false);
    this.add.existing(this.character);
    this.physics.world.enableBody(this.character, Phaser.Physics.Arcade.DYNAMIC_BODY)

    this.cameras.main.startFollow(this.character, true, 0.05, 0.05);




    this.terrainLayer?.setCollisionByProperty({ collides: true });
    this.physics.add.collider(this.character, this.terrainLayer, this.handleTerrainCollision, undefined, this);
  }

  handleTerrainCollision() {
    console.log('collided')
  }

  update(t: number, dt: number) {
    this.character.update(this.cursors)
  }

}
