import Phaser from "phaser";

enum Events {
  PLAYER_HEALTH_CHANGED = 'player-health-changed',
  PLAYER_HUNGER_CHANGED = 'player-hunger-changed',
  LOCK_PLAYER_MOVEMENT = 'lock-player-movement',
  SHOW_DIALOG = 'show-dialog',
  WON_LEVEL_1 = 'won-level-1',
}

const sceneEvents = new Phaser.Events.EventEmitter()

export {
  sceneEvents,
  Events
}