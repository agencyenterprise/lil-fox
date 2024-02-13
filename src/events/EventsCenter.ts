import Phaser from "phaser";

enum Events {
  PLAYER_HEALTH_CHANGED = 'player-health-changed',
  PLAYER_COLLECTED_BERRY = 'player-collected-berry',
  PLAYER_COLLECTED_COIN = 'player-collected-coin',
  LOCK_PLAYER_MOVEMENT = 'lock-player-movement',
  SHOW_DIALOG = 'show-dialog',
  SHOW_TIP = 'show-tip',
  WON_LEVEL_1 = 'won-level-1',
  WON_LEVEL_2 = 'won-level-2',
  CHARACTER_DIED = 'character-died',
  HIDE_CHARACTER_DIED_MODAL = 'hide-character-died-modal',
  UPDATE_COUNTDOWN_TIMER = 'update-countdown-timer',
}

const sceneEvents = new Phaser.Events.EventEmitter()

export {
  sceneEvents,
  Events
}