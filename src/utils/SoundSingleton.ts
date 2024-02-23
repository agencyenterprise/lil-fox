import { Events, sceneEvents } from "@/events/EventsCenter"
import { GameSettings } from "@/scenes/SettingsMenu"
import { getGameSetting } from "@/utils/localStorageUtils"

export enum SoundEffects {
  ARROW = "audio-arrow",
  CATOWNER_HELLO = "audio-hello",
  DAMAGE = "audio-damage",
  FOOTSTEPS1 = "audio-footsteps1",
  FOOTSTEPS2 = "audio-footsteps2",
  GAME_OVER = "audio-game-over",
  PICKUP = "audio-pickup",
  PICKUP_COIN = "audio-pickup-coin",
  THEME = "audio-theme",
  THEME_PLATFORM = "audio-theme-platform",
  ROAR = "audio-roar",
  JUMP_SMALL = "audio-jump-small",
  JUMP_BIG = "audio-jump-big",
  POWER_UP = "audio-power-up",
  SUCCESS = "audio-success",
}

export class SoundSingleton {
  private static instance: SoundSingleton | null = null
  private theme: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound
  private soundManager:
    | Phaser.Sound.NoAudioSoundManager
    | Phaser.Sound.HTML5AudioSoundManager
    | Phaser.Sound.WebAudioSoundManager

  public musicEnabled = getGameSetting(GameSettings.MUSIC_ENABLED) ?? true
  public musicVolume = getGameSetting(GameSettings.MUSIC_VOLUME) ?? 3
  public soundEffectsEnabled = getGameSetting(GameSettings.SOUND_EFFECTS_ENABLED) ?? true
  public soundEffectsVolume = getGameSetting(GameSettings.SOUND_EFFECTS_VOLUME) ?? 3

  public playerCurrentAreas: string[] = []

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
    sceneEvents.on(Events.CHANGE_MUSIC_VOLUME, (v: number) => this.changeThemeVolume(v), this)

    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      sceneEvents.removeAllListeners(Events.CHANGE_MUSIC_VOLUME)
      sceneEvents.removeAllListeners(Events.STOP_MUSIC)
      sceneEvents.removeAllListeners(Events.PAUSE_MUSIC)
      sceneEvents.removeAllListeners(Events.RESUME_MUSIC)

      this.stopTheme()
    })
  }

  public playTheme(theme: SoundEffects) {
    if (this.theme) {
      this.theme.stop()
    }

    this.theme = this.soundManager.add(theme, {
      volume: this.musicVolume / 10,
      loop: true,
    })

    this.theme.play()

    if (!this.musicEnabled) {
      this.theme.pause()
    }
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

  public playSoundEffect(soundEffect: SoundEffects, area?: string) {
    if (!this.soundEffectsEnabled) {
      return
    }

    if (area && !this.playerCurrentAreas.includes(area)) {
      return
    }

    if (this.soundManager.getAllPlaying().filter((s) => s.key == soundEffect).length > 0) {
      return
    }

    this.soundManager.play(soundEffect, {
      volume: this.soundEffectsVolume / 10,
    })
  }

  public addPlayerCurrentArea(area: string) {
    if (!this.playerCurrentAreas.includes(area)) {
      this.playerCurrentAreas.push(area)
    }
  }

  public removePlayerCurrentArea(area: string) {
    if (this.playerCurrentAreas.includes(area)) {
      this.playerCurrentAreas = this.playerCurrentAreas.filter((a) => a !== area)
    }
  }
}
