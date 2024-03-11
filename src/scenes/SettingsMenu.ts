import Phaser from "phaser"
import { Events, sceneEvents } from "@/events/EventsCenter"
import { SoundSingleton } from "@/utils/SoundSingleton"
import { setGameSettings } from "@/utils/localStorageUtils"

export enum GameSettings {
  MUSIC_ENABLED = "music-enabled",
  MUSIC_VOLUME = "music-volume",
  SOUND_EFFECTS_ENABLED = "sound-effects-enabled",
  SOUND_EFFECTS_VOLUME = "sound-effects-volume",
}

export default class SettingsMenu {
  private container!: Phaser.GameObjects.Container
  private checkmarkMusic!: Phaser.GameObjects.Image
  private checkmarkSoundEffects!: Phaser.GameObjects.Image
  public musicVolumeText!: Phaser.GameObjects.Text
  public soundEffectsVolumeText!: Phaser.GameObjects.Text

  private _opened = false

  get isOpen() {
    return this._opened
  }

  constructor(scene: Phaser.Scene) {
    const { width } = scene.scale

    this.container = scene.add.container(width - 15, 55)
    this.container.setVisible(false)

    const panel = scene.add.nineslice(0, 0, "panel", 0, 150, 50, 24, 24).setScale(2, 2.3).setOrigin(1, 0)
    this.container.add(panel)

    let previousButton = this.createToggleMusicButton(scene, panel)
    previousButton = this.createToggleSoundEffectsButton(scene, previousButton)
    previousButton = this.createMusicVolumeButton(scene, previousButton)
    this.createSoundEffectsVolumeButton(scene, previousButton)
  }

  show() {
    this.container.setVisible(true)
    this._opened = true
  }

  hide() {
    this.container.setVisible(false)
    this._opened = false
  }

  private createToggleMusicButton(scene: Phaser.Scene, panel: Phaser.GameObjects.NineSlice) {
    const toggleMusicButton = scene.add.image(-panel.width - 125, 25, "small-button")

    this.checkmarkMusic = scene.add
      .image(-panel.width - 125, 25, "checkmark")
      .setVisible(SoundSingleton.getInstance().musicEnabled)

    const textMusic = scene.add.text(-panel.width - 100, 25 - 7, "Music", {
      color: "#000000",
      fontSize: "16px",
    })

    this.container.add(toggleMusicButton)
    this.container.add(this.checkmarkMusic)
    this.container.add(textMusic)

    toggleMusicButton.setInteractive().on(Phaser.Input.Events.POINTER_UP, () => {
      if (this.checkmarkMusic.visible) {
        this.checkmarkMusic.setVisible(false)
        sceneEvents.emit(Events.PAUSE_MUSIC)
        SoundSingleton.getInstance().musicEnabled = false
        setGameSettings(GameSettings.MUSIC_ENABLED, false)
      } else {
        this.checkmarkMusic.setVisible(true)
        sceneEvents.emit(Events.RESUME_MUSIC)
        SoundSingleton.getInstance().musicEnabled = true
        setGameSettings(GameSettings.MUSIC_ENABLED, true)
      }
    })

    return { x: toggleMusicButton.x, y: toggleMusicButton.y }
  }

  private createToggleSoundEffectsButton(scene: Phaser.Scene, previousButton: { x: number; y: number }) {
    const toggleSoundEffectsButton = scene.add.image(previousButton.x, previousButton.y + 40, "small-button")

    this.checkmarkSoundEffects = scene.add
      .image(previousButton.x, previousButton.y + 40, "checkmark")
      .setVisible(SoundSingleton.getInstance().soundEffectsEnabled)

    const textSoundEffects = scene.add.text(previousButton.x + 25, previousButton.y + 40 - 7, "Sound Effects", {
      color: "#000000",
      fontSize: "16px",
    })

    this.container.add(toggleSoundEffectsButton)
    this.container.add(this.checkmarkSoundEffects)
    this.container.add(textSoundEffects)

    toggleSoundEffectsButton.setInteractive().on(Phaser.Input.Events.POINTER_UP, () => {
      if (this.checkmarkSoundEffects.visible) {
        this.checkmarkSoundEffects.setVisible(false)
        SoundSingleton.getInstance().soundEffectsEnabled = false
        setGameSettings(GameSettings.SOUND_EFFECTS_ENABLED, false)
      } else {
        this.checkmarkSoundEffects.setVisible(true)
        SoundSingleton.getInstance().soundEffectsEnabled = true
        setGameSettings(GameSettings.SOUND_EFFECTS_ENABLED, true)
      }
    })

    return { x: toggleSoundEffectsButton.x, y: toggleSoundEffectsButton.y }
  }

  private createMusicVolumeButton(scene: Phaser.Scene, previousButton: { x: number; y: number }) {
    const headerMusicVolume = scene.add.text(previousButton.x - 15, previousButton.y + 25, "Music Volume", {
      color: "#000000",
      fontSize: "16px",
    })

    const decreaseVolumeMusicButton = scene.add.image(previousButton.x, headerMusicVolume.y + 40, "small-button")

    const decreaseVolumeMusicText = scene.add.text(
      decreaseVolumeMusicButton.x - 5,
      decreaseVolumeMusicButton.y - 10,
      "-",
      {
        color: "#1da7e1",
        fontSize: "20px",
      },
    )

    this.musicVolumeText = scene.add.text(
      decreaseVolumeMusicButton.x + decreaseVolumeMusicButton.width - 7,
      decreaseVolumeMusicButton.y - 7,
      SoundSingleton.getInstance().musicVolume.toString(),
      {
        color: "#000000",
        fontSize: "16px",
      },
    )

    const increaseVolumeMusicButton = scene.add.image(
      this.musicVolumeText.x + this.musicVolumeText.width + 30,
      decreaseVolumeMusicButton.y,
      "small-button",
    )

    const increaseVolumeMusicText = scene.add.text(
      increaseVolumeMusicButton.x - 5,
      increaseVolumeMusicButton.y - 10,
      "+",
      {
        color: "#1da7e1",
        fontSize: "20px",
      },
    )

    this.container.add(headerMusicVolume)
    this.container.add(decreaseVolumeMusicButton)
    this.container.add(decreaseVolumeMusicText)
    this.container.add(this.musicVolumeText)
    this.container.add(increaseVolumeMusicButton)
    this.container.add(increaseVolumeMusicText)

    decreaseVolumeMusicButton.setInteractive().on(Phaser.Input.Events.POINTER_UP, () => {
      if (SoundSingleton.getInstance().musicVolume > 1) {
        SoundSingleton.getInstance().musicVolume--
        setGameSettings(GameSettings.MUSIC_VOLUME, SoundSingleton.getInstance().musicVolume)

        this.musicVolumeText.setText(SoundSingleton.getInstance().musicVolume.toString())

        if (SoundSingleton.getInstance().musicVolume !== 10) {
          //this.musicVolumeText.setX(-panel.width + 32)
        }

        sceneEvents.emit(Events.CHANGE_MUSIC_VOLUME, SoundSingleton.getInstance().musicVolume / 10)
      }
    })

    increaseVolumeMusicButton.setInteractive().on(Phaser.Input.Events.POINTER_UP, () => {
      if (SoundSingleton.getInstance().musicVolume < 10) {
        SoundSingleton.getInstance().musicVolume++
        setGameSettings(GameSettings.MUSIC_VOLUME, SoundSingleton.getInstance().musicVolume)

        this.musicVolumeText.setText(SoundSingleton.getInstance().musicVolume.toString())

        if (SoundSingleton.getInstance().musicVolume === 10) {
          //this.musicVolumeText.setX(-panel.width + 28)
        }

        sceneEvents.emit(Events.CHANGE_MUSIC_VOLUME, SoundSingleton.getInstance().musicVolume / 10)
      }
    })

    return { x: decreaseVolumeMusicButton.x, y: decreaseVolumeMusicButton.y }
  }

  private createSoundEffectsVolumeButton(scene: Phaser.Scene, previousButton: { x: number; y: number }) {
    const headerSoundEffectsVolume = scene.add.text(
      previousButton.x - 15,
      previousButton.y + 25,
      "Sound Effects Volume",
      {
        color: "#000000",
        fontSize: "16px",
      },
    )

    const decreaseVolumeSoundEffectsButton = scene.add.image(
      previousButton.x,
      headerSoundEffectsVolume.y + 40,
      "small-button",
    )

    const decreaseVolumeSoundEffectsText = scene.add.text(
      decreaseVolumeSoundEffectsButton.x - 5,
      decreaseVolumeSoundEffectsButton.y - 10,
      "-",
      {
        color: "#1da7e1",
        fontSize: "20px",
      },
    )

    this.soundEffectsVolumeText = scene.add.text(
      decreaseVolumeSoundEffectsButton.x + decreaseVolumeSoundEffectsButton.width - 7,
      decreaseVolumeSoundEffectsButton.y - 7,
      SoundSingleton.getInstance().soundEffectsVolume.toString(),
      {
        color: "#000000",
        fontSize: "16px",
      },
    )

    const increaseVolumeSoundEffectsButton = scene.add.image(
      this.soundEffectsVolumeText.x + this.soundEffectsVolumeText.width + 30,
      decreaseVolumeSoundEffectsButton.y,
      "small-button",
    )

    const increaseVolumeSoundEffectsText = scene.add.text(
      increaseVolumeSoundEffectsButton.x - 5,
      increaseVolumeSoundEffectsButton.y - 10,
      "+",
      {
        color: "#1da7e1",
        fontSize: "20px",
      },
    )

    this.container.add(headerSoundEffectsVolume)
    this.container.add(decreaseVolumeSoundEffectsButton)
    this.container.add(decreaseVolumeSoundEffectsText)
    this.container.add(this.soundEffectsVolumeText)
    this.container.add(increaseVolumeSoundEffectsButton)
    this.container.add(increaseVolumeSoundEffectsText)

    decreaseVolumeSoundEffectsButton.setInteractive().on(Phaser.Input.Events.POINTER_UP, () => {
      if (SoundSingleton.getInstance().soundEffectsVolume > 1) {
        SoundSingleton.getInstance().soundEffectsVolume--
        setGameSettings(GameSettings.SOUND_EFFECTS_VOLUME, SoundSingleton.getInstance().musicVolume)

        this.soundEffectsVolumeText.setText(SoundSingleton.getInstance().soundEffectsVolume.toString())

        if (SoundSingleton.getInstance().soundEffectsVolume !== 10) {
          //this.soundEffectsVolumeText.setX(-panel.width + 32)
        }
      }
    })

    increaseVolumeSoundEffectsButton.setInteractive().on(Phaser.Input.Events.POINTER_UP, () => {
      if (SoundSingleton.getInstance().soundEffectsVolume < 10) {
        SoundSingleton.getInstance().soundEffectsVolume++
        setGameSettings(GameSettings.SOUND_EFFECTS_VOLUME, SoundSingleton.getInstance().musicVolume)

        this.soundEffectsVolumeText.setText(SoundSingleton.getInstance().soundEffectsVolume.toString())

        if (SoundSingleton.getInstance().soundEffectsVolume === 10) {
          //this.soundEffectsVolumeText.setX(-panel.width + 28)
        }
      }
    })
  }
}
