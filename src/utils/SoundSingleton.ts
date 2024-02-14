import { Events, sceneEvents } from "@/events/EventsCenter"

export enum SoundEffects {
  CATOWNER_HELLO = "audio-hello",
  DAMAGE = "audio-damage",
  FOOTSTEPS1 = "audio-footsteps1",
  FOOTSTEPS2 = "audio-footsteps2",
  GAME_OVER = "audio-game-over",
  PICKUP = "audio-pickup",
  THEME = "audio-theme",
}

export class SoundSingleton {
  private static instance: SoundSingleton | null = null
  private theme:
    | Phaser.Sound.NoAudioSound
    | Phaser.Sound.HTML5AudioSound
    | Phaser.Sound.WebAudioSound
  private soundManager:
    | Phaser.Sound.NoAudioSoundManager
    | Phaser.Sound.HTML5AudioSoundManager
    | Phaser.Sound.WebAudioSoundManager

  public soundEffectsEnabled = true
  public musicVolume = 3
  public soundEffectsVolume = 3

  private constructor() {}

  public static getInstance(): SoundSingleton {
    if (!SoundSingleton.instance) {
      SoundSingleton.instance = new SoundSingleton()
    }
    return SoundSingleton.instance
  }

  public setSoundManager(scene: Phaser.Scene) {
    this.soundManager = scene.sound

    sceneEvents.on(Events.STOP_MUSIC, () => this.stopTheme(), this)
    sceneEvents.on(Events.PAUSE_MUSIC, () => this.pauseTheme(), this)
    sceneEvents.on(Events.RESUME_MUSIC, () => this.resumeTheme(), this)
    sceneEvents.on(
      Events.CHANGE_MUSIC_VOLUME,
      (v: number) => this.changeThemeVolume(v),
      this,
    )

    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      sceneEvents.removeAllListeners(Events.CHANGE_MUSIC_VOLUME)
      sceneEvents.removeAllListeners(Events.STOP_MUSIC)
      sceneEvents.removeAllListeners(Events.PAUSE_MUSIC)
      sceneEvents.removeAllListeners(Events.RESUME_MUSIC)

      this.stopTheme()
    })
  }

  public playTheme() {
    this.theme = this.soundManager.add(SoundEffects.THEME, {
      volume: this.musicVolume / 10,
      loop: true,
    })

    this.theme.play()
  }

  stopTheme() {
    this.theme.stop()
  }

  pauseTheme() {
    this.theme.pause()
  }

  resumeTheme() {
    this.theme.resume()
  }

  changeThemeVolume(volume: number) {
    this.theme.setVolume(volume)
  }

  public playSoundEffect(soundEffect: SoundEffects) {
    if (!this.soundEffectsEnabled) {
      return
    }

    if (
      this.soundManager.getAllPlaying().filter((s) => s.key == soundEffect)
        .length > 0
    ) {
      return
    }

    this.soundManager.play(soundEffect, {
      volume: this.soundEffectsVolume / 10,
    })
  }
}
