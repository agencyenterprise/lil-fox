import Phaser from "phaser";

export default class Preloader extends Phaser.Scene {

    constructor() {
        super('preloader');
    }

    preload () {
        this.load.image('tiles1', 'tiles/16oga.png')
        this.load.tilemapTiledJSON('map', 'tiles/lil-fox-map.json')

        this.load.atlas('lizard_idle', 'enemies/lizard_idle.png', 'enemies/lizard_idle.json')
        this.load.atlas('lizard_run', 'enemies/lizard_run.png', 'enemies/lizard_run.json')
    }

    create() {
        this.scene.start('LilFox');
    }
}