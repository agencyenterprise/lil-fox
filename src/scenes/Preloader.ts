import Phaser from "phaser";
export default class Preloader extends Phaser.Scene {

  constructor() {
    super('preloader');
  }

  preload() {
    this.load.image('tiles0', 'tiles/punyworld-overworld-tileset.png')
    this.load.image('tiles1', 'tiles/16oga.png')
    this.load.image('tiles2', 'tiles/DungeonTileset.png')
    this.load.tilemapTiledJSON('map', 'tiles/lil-fox-map.json')

    this.load.atlas('green_archer_shooting', 'enemies/green-archer.png', 'enemies/green-archer.json')
    this.load.atlas('lizard_idle', 'enemies/lizard_idle.png', 'enemies/lizard_idle.json')
    this.load.atlas('lizard_run', 'enemies/lizard_run.png', 'enemies/lizard_run.json')
    this.load.atlas('treasure', 'items/treasure.png', 'items/treasure.json')

    this.load.image('ui-heart-empty', 'ui/ui_heart_empty.png')
    this.load.image('ui-heart-full', 'ui/ui_heart_full.png')
    this.load.image('ui-heart-half', 'ui/ui_heart_half.png')

    this.load.image('berry', 'food/blueberry.png')
    this.load.image('berry-empty', 'food/blueberry-empty.png')

    this.load.image('panel', 'ui/grey_panel.png')
    this.load.image('small-button', 'ui/grey_box.png')
    this.load.image('gear', 'ui/gear.png')
    this.load.image('checkmark', 'ui/blue_checkmark.png')

    this.load.image('green_arrow', 'weapons/green_arrow.png')

    this.load.image("cursor", `ui/cursor.png`);
  }

  create() {
    this.scene.start('LilFox');
  }
}