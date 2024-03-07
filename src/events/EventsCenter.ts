import Phaser from "phaser"

enum Events {
  PLAYER_HEALTH_CHANGED = "player-health-changed",
  PLAYER_COLLECTED_BERRY = "player-collected-berry",
  PLAYER_ACCUMULATED_COIN = "player-accumulated-coin",
  PLAYER_COLLECTED_COIN = "player-collected-coin",
  LOCK_PLAYER_MOVEMENT = "lock-player-movement",
  SHOW_TIP = "show-tip",
  WON_LEVEL_1 = "won-level-1",
  WON_LEVEL_2 = "won-level-2",
  GAME_OVER = "game-over",
  UPDATE_COUNTDOWN_TIMER = "update-countdown-timer",
  WIN_MARIO_LIKE_LEVEL = "win-mario-like-level",
  STOP_MUSIC = "stop-music",
  PAUSE_MUSIC = "pause-music",
  RESUME_MUSIC = "resume-music",
  CHANGE_MUSIC_VOLUME = "change-music-volume",
  CHARACTER_DIED = "character-died",
  FOX_GAME_LEVEL_STARTED = "fox-game-level-started",
  MARIO_LIKE_LEVEL_STARTED = "mario-like-level-started",
  MARIO_LIKE_LEVEL_FINISHED = "mario-like-level-finished",
  GRANDPA_LETTER_OPEN = "grandpa-letter-open",
  GRANDPA_LETTER_READ = "grandpa-letter-read",
  GRANDPA_MAP_COLLECTED = "grandpa-map-collected",
  GRANDPA_POUCH_COLLECTED = "grandpa-pouch-collected",
  GRANDPA_BACKPACK_COLLECTED = "grandpa-backpack-collected",
}

const sceneEvents = new Phaser.Events.EventEmitter()

export { sceneEvents, Events }
