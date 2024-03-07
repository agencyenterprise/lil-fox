import Phaser from "phaser"
import { SoundEffects } from "@/utils/SoundSingleton"

export default class Preloader extends Phaser.Scene {
  constructor() {
    super("preloader")
  }

  preload() {
    this.load.image("tiles0", "tiles/punyworld-overworld-tileset.png")
    this.load.image("tiles1", "tiles/16oga.png")
    this.load.image("tiles2", "tiles/DungeonTileset.png")
    this.load.image("tiles3", "tiles/nature-paltformer-tileset-16x16.png")
    this.load.image("tiles4", "tiles/CuteRPG_Interior_custom.png")
    this.load.image("tiles5", "tiles/Interiors_free_16x16.png")

    this.load.tilemapTiledJSON("map", "tiles/lil-fox-map.json")
    this.load.tilemapTiledJSON("platform-level-map", "tiles/platform-level.json")
    this.load.tilemapTiledJSON("grandpa-home-map", "tiles/grandpa-home-map.json")

    this.load.atlas(
      "green_archer_shooting",
      "enemies/right_facing_green_archer.png",
      "enemies/right_facing_green_archer.json",
    )
    this.load.atlas(
      "green_archer_shooting_right",
      "enemies/right_facing_green_archer.png",
      "enemies/right_facing_green_archer.json",
    )
    this.load.atlas(
      "green_archer_shooting_left",
      "enemies/left_facing_green_archer.png",
      "enemies/left_facing_green_archer.json",
    )

    this.load.atlas("lizard_idle", "enemies/lizard_idle.png", "enemies/lizard_idle.json")
    this.load.atlas("lizard_run", "enemies/lizard_run.png", "enemies/lizard_run.json")
    this.load.atlas("slug", "enemies/slug.png", "enemies/slug.json")
    this.load.atlas("treasure", "items/treasure.png", "items/treasure.json")
    this.load.atlas("cat_swinging_tail", "npcs/cat/cat_swinging_tail.png", "npcs/cat/cat_swinging_tail.json")
    this.load.atlas("cat_licking", "npcs/cat/cat_licking.png", "npcs/cat/cat_licking.json")
    this.load.atlas("cat_cleaning_head", "npcs/cat/cat_cleaning_head.png", "npcs/cat/cat_cleaning_head.json")
    this.load.atlas("cat_walking", "npcs/cat/cat_walking.png", "npcs/cat/cat_walking.json")

    this.load.atlas(
      "cat_owner_walking_left",
      "npcs/cat-owner/cat-owner-walking-left.png",
      "npcs/cat-owner/cat-owner-walking-left.json",
    )
    this.load.atlas(
      "cat_owner_walking_right",
      "npcs/cat-owner/cat-owner-walking-right.png",
      "npcs/cat-owner/cat-owner-walking-right.json",
    )
    this.load.atlas(
      "cat_owner_standing",
      "npcs/cat-owner/cat-owner-standing.png",
      "npcs/cat-owner/cat-owner-standing.json",
    )

    this.load.atlas(
      "human_in_blue_walking_up",
      "npcs/humans/wearing_blue/human_wearing_blue_walking_up.png",
      "npcs/humans/wearing_blue/human_wearing_blue_walking_up.json",
    )
    this.load.atlas(
      "human_in_blue_walking_down",
      "npcs/humans/wearing_blue/human_wearing_blue_walking_down.png",
      "npcs/humans/wearing_blue/human_wearing_blue_walking_down.json",
    )
    this.load.atlas(
      "human_in_blue_looking_left",
      "npcs/humans/wearing_blue/human_wearing_blue_looking_left.png",
      "npcs/humans/wearing_blue/human_wearing_blue_looking_left.json",
    )

    this.load.atlas(
      "A_INVENTORY", 
      "inventory/assets/ui.png", 
      "inventory/assets/ui.json", 
    )

    this.load.atlas(
      "A_Items", 
      "inventory/assets/items/items.png", 
      "inventory/assets/items/items.json", 
    )

    this.load.image("ui-heart-empty", "ui/ui_heart_empty.png")
    this.load.image("ui-heart-full", "ui/ui_heart_full.png")
    this.load.image("ui-heart-half", "ui/ui_heart_half.png")

    this.load.image("coin", "items/coin.png")
    this.load.image("greenPotion", "items/greenPotion.png")
    this.load.image("orangePotion", "items/orangePotion.png")
    this.load.image("door", "items/door.png")
    this.load.image("letter", "items/letter.png")
    this.load.image("letterOpen", "items/letterOpen.png")
    this.load.image("map", "items/map.png")
    this.load.image("pouch", "items/pouch.png")
    this.load.image("backpack", "items/backpack.png")

    this.load.image("berry", "food/blueberry.png")
    this.load.image("berry-empty", "food/blueberry-empty.png")

    this.load.image("panel", "ui/grey_panel.png")
    this.load.image("small-button", "ui/grey_box.png")
    this.load.image("gear", "ui/gear.png")
    this.load.image("checkmark", "ui/blue_checkmark.png")

    this.load.image("arrow", "weapons/arrow.png")

    this.load.image("cursor", `ui/cursor.png`)

    this.load.audio(SoundEffects.THEME, ["assets/audio/theme.ogg", "assets/audio/theme.mp3"])
    this.load.audio(SoundEffects.THEME_GRANDPA, ["assets/audio/theme-grandpa.ogg", "assets/audio/theme-grandpa.mp3"])
    this.load.audio(SoundEffects.THEME_PLATFORM, ["assets/audio/theme-platform.ogg", "assets/audio/theme-platform.mp3"])
    this.load.audio(SoundEffects.GAME_OVER, ["assets/audio/game-over.ogg", "assets/audio/game-over.mp3"])
    this.load.audio(SoundEffects.DAMAGE, ["assets/audio/ouch.ogg", "assets/audio/ouch.mp3"])
    this.load.audio(SoundEffects.PICKUP, ["assets/audio/pickup.ogg", "assets/audio/pickup.mp3"])
    this.load.audio(SoundEffects.PICKUP_COIN, ["assets/audio/coin.ogg", "assets/audio/coin.mp3"])
    this.load.audio(SoundEffects.CATOWNER_HELLO, ["assets/audio/catowner-hello.ogg", "assets/audio/catowner-hello.mp3"])
    this.load.audio(SoundEffects.FOOTSTEPS1, ["assets/audio/footsteps-01.ogg", "assets/audio/footsteps-01.mp3"])
    this.load.audio(SoundEffects.FOOTSTEPS2, ["assets/audio/footsteps-02.ogg", "assets/audio/footsteps-02.mp3"])
    this.load.audio(SoundEffects.ARROW, ["assets/audio/arrow.ogg", "assets/audio/arrow.mp3"])
    this.load.audio(SoundEffects.ROAR, ["assets/audio/roar.ogg", "assets/audio/roar.mp3"])
    this.load.audio(SoundEffects.JUMP_SMALL, ["assets/audio/jump-small.ogg", "assets/audio/jump-small.mp3"])
    this.load.audio(SoundEffects.JUMP_BIG, ["assets/audio/jump-big.ogg", "assets/audio/jump-big.mp3"])
    this.load.audio(SoundEffects.POWER_UP, ["assets/audio/power-up.ogg", "assets/audio/power-up.mp3"])
    this.load.audio(SoundEffects.SUCCESS, ["assets/audio/success.ogg", "assets/audio/success.mp3"])
    this.load.audio(SoundEffects.DOOR_OPEN, ["assets/audio/door-open.ogg", "assets/audio/door-open.mp3"])
    this.load.audio(SoundEffects.PICKUP_PAPER, ["assets/audio/pickup-paper.ogg", "assets/audio/pickup-paper.mp3"])
  }

  create() {
    this.scene.start("GrandpaScene")
  }
}
