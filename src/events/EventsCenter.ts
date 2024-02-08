import Phaser from "phaser";

enum Events {
  PLAYER_HEALTH_CHANGED = "player-health-changed",
  PLAYER_COLLECTED_BERRY = "player-collected-berry",
  LOCK_PLAYER_MOVEMENT = "lock-player-movement",
  SHOW_DIALOG = "show-dialog",
  SHOW_TIP = "show-tip",
  WON_LEVEL_1 = "won-level-1",
  WON_LEVEL_2 = "won-level-2",
  CHARACTER_DIED = "character-died",
  STOP_MUSIC = "stop-music",
  PAUSE_MUSIC = "pause-music",
  RESUME_MUSIC = "resume-music",
  CHANGE_MUSIC_VOLUME = "change-music-volume",
}

const sceneEvents = new Phaser.Events.EventEmitter();

export { sceneEvents, Events };
