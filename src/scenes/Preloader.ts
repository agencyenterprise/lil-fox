import Phaser from "phaser";
export default class Preloader extends Phaser.Scene {

  constructor() {
    super('preloader');
  }

  preload() {
    this.load.image('tiles1', 'tiles/16oga.png')
    this.load.image('tiles2', 'tiles/DungeonTileset.png')
    this.load.tilemapTiledJSON('map', 'tiles/lil-fox-map.json')

    this.load.atlas('lizard_idle', 'enemies/lizard_idle.png', 'enemies/lizard_idle.json')
    this.load.atlas('lizard_run', 'enemies/lizard_run.png', 'enemies/lizard_run.json')
    this.load.atlas('treasure', 'items/treasure.png', 'items/treasure.json')

    this.load.image('ui-heart-empty', 'ui/ui_heart_empty.png')
    this.load.image('ui-heart-full', 'ui/ui_heart_full.png')
    this.load.image('ui-heart-half', 'ui/ui_heart_half.png')

    this.load.image('berry', 'food/01.png')
  }

  create() {
    this.scene.start('LilFox');
  }
}