import Phaser from "phaser"
import { Events, sceneEvents } from "@/events/EventsCenter"
import { SoundSingleton } from "@/utils/SoundSingleton"
import { setGameSettings } from "@/utils/localStorageUtils"

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

    this.container = scene.add.container(width - 5, 25)
    this.container.setVisible(false)

    const panel = scene.add
      .nineslice(0, 0, "panel", 0, 150, 50, 24, 24)
      .setOrigin(1, 0)
    this.container.add(panel)

    this.createToggleMusicButton(scene, panel)
    this.createToggleSoundEffectsButton(scene, panel)
    this.createMusicVolumeButton(scene, panel)
    this.createSoundEffectsVolumeButton(scene, panel)
  }

  show() {
    this.container.setVisible(true)
    this._opened = true
  }

  hide() {
    this.container.setVisible(false)
    this._opened = false
  }

  private createToggleMusicButton(
    scene: Phaser.Scene,
    panel: Phaser.GameObjects.NineSlice,
  ) {
    const toggleMusicButton = scene.add
      .image(-panel.width + 15, 15, "small-button")
      .setScale(0.4)

    this.checkmarkMusic = scene.add
      .image(-panel.width + 15, 15, "checkmark")
      .setScale(0.4)
      .setVisible(SoundSingleton.getInstance().musicEnabled)

    const textMusic = scene.add.text(-panel.width + 25, 9, "Music", {
      color: "#000000",
      fontSize: "10px",
    })

    this.container.add(toggleMusicButton)
    this.container.add(this.checkmarkMusic)
    this.container.add(textMusic)

    toggleMusicButton
      .setInteractive()
      .on(Phaser.Input.Events.POINTER_UP, () => {
        if (this.checkmarkMusic.visible) {
          this.checkmarkMusic.setVisible(false)
          sceneEvents.emit(Events.PAUSE_MUSIC)
          SoundSingleton.getInstance().musicEnabled = false
          setGameSettings("musicEnabled", false)
        } else {
          this.checkmarkMusic.setVisible(true)
          sceneEvents.emit(Events.RESUME_MUSIC)
          SoundSingleton.getInstance().musicEnabled = true
          setGameSettings("musicEnabled", true)
        }
      })
  }

  private createToggleSoundEffectsButton(
    scene: Phaser.Scene,
    panel: Phaser.GameObjects.NineSlice,
  ) {
    const toggleSoundEffectsButton = scene.add
      .image(-panel.width + 15, 30, "small-button")
      .setScale(0.4)

    this.checkmarkSoundEffects = scene.add
      .image(-panel.width + 15, 30, "checkmark")
      .setScale(0.4)
      .setVisible(SoundSingleton.getInstance().soundEffectsEnabled)

    const textSoundEffects = scene.add.text(
      -panel.width + 25,
      24,
      "Sound Effects",
      {
        color: "#000000",
        fontSize: "10px",
      },
    )

    this.container.add(toggleSoundEffectsButton)
    this.container.add(this.checkmarkSoundEffects)
    this.container.add(textSoundEffects)

    toggleSoundEffectsButton
      .setInteractive()
      .on(Phaser.Input.Events.POINTER_UP, () => {
        if (this.checkmarkSoundEffects.visible) {
          this.checkmarkSoundEffects.setVisible(false)
          SoundSingleton.getInstance().soundEffectsEnabled = false
          setGameSettings("soundEffectsEnabled", false)
        } else {
          this.checkmarkSoundEffects.setVisible(true)
          SoundSingleton.getInstance().soundEffectsEnabled = true
          setGameSettings("soundEffectsEnabled", true)
        }
      })
  }

  private createMusicVolumeButton(
    scene: Phaser.Scene,
    panel: Phaser.GameObjects.NineSlice,
  ) {
    const headerMusicVolume = scene.add.text(
      -panel.width + 7,
      40,
      "Music Volume",
      {
        color: "#000000",
        fontSize: "10px",
      },
    )

    const decreaseVolumeMusicButton = scene.add
      .image(-panel.width + 15, headerMusicVolume.y + 18, "small-button")
      .setScale(0.4)

    const decreaseVolumeMusicText = scene.add.text(
      -panel.width + 10,
      headerMusicVolume.y + 10,
      "-",
      {
        color: "#1da7e1",
        fontSize: "16px",
      },
    )

    this.musicVolumeText = scene.add.text(
      -panel.width + 32,
      headerMusicVolume.y + 13,
      SoundSingleton.getInstance().musicVolume.toString(),
      {
        color: "#000000",
        fontSize: "10px",
      },
    )

    const increaseVolumeMusicButton = scene.add
      .image(-panel.width + 55, headerMusicVolume.y + 18, "small-button")
      .setScale(0.4)

    const increaseVolumeMusicText = scene.add.text(
      -panel.width + 50,
      headerMusicVolume.y + 11,
      "+",
      {
        color: "#1da7e1",
        fontSize: "16px",
      },
    )

    this.container.add(headerMusicVolume)
    this.container.add(decreaseVolumeMusicButton)
    this.container.add(decreaseVolumeMusicText)
    this.container.add(this.musicVolumeText)
    this.container.add(increaseVolumeMusicButton)
    this.container.add(increaseVolumeMusicText)

    decreaseVolumeMusicButton
      .setInteractive()
      .on(Phaser.Input.Events.POINTER_UP, () => {
        if (SoundSingleton.getInstance().musicVolume > 1) {
          SoundSingleton.getInstance().musicVolume--
          setGameSettings(
            "musicVolume",
            SoundSingleton.getInstance().musicVolume,
          )

          this.musicVolumeText.setText(
            SoundSingleton.getInstance().musicVolume.toString(),
          )

          if (SoundSingleton.getInstance().musicVolume !== 10) {
            this.musicVolumeText.setX(-panel.width + 32)
          }

          sceneEvents.emit(
            Events.CHANGE_MUSIC_VOLUME,
            SoundSingleton.getInstance().musicVolume / 10,
          )
        }
      })

    increaseVolumeMusicButton
      .setInteractive()
      .on(Phaser.Input.Events.POINTER_UP, () => {
        if (SoundSingleton.getInstance().musicVolume < 10) {
          SoundSingleton.getInstance().musicVolume++
          setGameSettings(
            "musicVolume",
            SoundSingleton.getInstance().musicVolume,
          )

          this.musicVolumeText.setText(
            SoundSingleton.getInstance().musicVolume.toString(),
          )

          if (SoundSingleton.getInstance().musicVolume === 10) {
            this.musicVolumeText.setX(-panel.width + 28)
          }

          sceneEvents.emit(
            Events.CHANGE_MUSIC_VOLUME,
            SoundSingleton.getInstance().musicVolume / 10,
          )
        }
      })
  }

  private createSoundEffectsVolumeButton(
    scene: Phaser.Scene,
    panel: Phaser.GameObjects.NineSlice,
  ) {
    const headerSoundEffectsVolume = scene.add.text(
      -panel.width + 7,
      68,
      "Sound Effects Volume",
      {
        color: "#000000",
        fontSize: "10px",
      },
    )

    const decreaseVolumeSoundEffectsButton = scene.add
      .image(-panel.width + 15, headerSoundEffectsVolume.y + 18, "small-button")
      .setScale(0.4)

    const decreaseVolumeSoundEffectsText = scene.add.text(
      -panel.width + 10,
      headerSoundEffectsVolume.y + 10,
      "-",
      {
        color: "#1da7e1",
        fontSize: "16px",
      },
    )

    this.soundEffectsVolumeText = scene.add.text(
      -panel.width + 32,
      headerSoundEffectsVolume.y + 13,
      SoundSingleton.getInstance().soundEffectsVolume.toString(),
      {
        color: "#000000",
        fontSize: "10px",
      },
    )

    const increaseVolumeSoundEffectsButton = scene.add
      .image(-panel.width + 55, headerSoundEffectsVolume.y + 18, "small-button")
      .setScale(0.4)

    const increaseVolumeSoundEffectsText = scene.add.text(
      -panel.width + 50,
      headerSoundEffectsVolume.y + 11,
      "+",
      {
        color: "#1da7e1",
        fontSize: "16px",
      },
    )

    this.container.add(headerSoundEffectsVolume)
    this.container.add(decreaseVolumeSoundEffectsButton)
    this.container.add(decreaseVolumeSoundEffectsText)
    this.container.add(this.soundEffectsVolumeText)
    this.container.add(increaseVolumeSoundEffectsButton)
    this.container.add(increaseVolumeSoundEffectsText)

    decreaseVolumeSoundEffectsButton
      .setInteractive()
      .on(Phaser.Input.Events.POINTER_UP, () => {
        if (SoundSingleton.getInstance().soundEffectsVolume > 1) {
          SoundSingleton.getInstance().soundEffectsVolume--
          setGameSettings(
            "soundEffectsVolume",
            SoundSingleton.getInstance().musicVolume,
          )

          this.soundEffectsVolumeText.setText(
            SoundSingleton.getInstance().soundEffectsVolume.toString(),
          )

          if (SoundSingleton.getInstance().soundEffectsVolume !== 10) {
            this.soundEffectsVolumeText.setX(-panel.width + 32)
          }
        }
      })

    increaseVolumeSoundEffectsButton
      .setInteractive()
      .on(Phaser.Input.Events.POINTER_UP, () => {
        if (SoundSingleton.getInstance().soundEffectsVolume < 10) {
          SoundSingleton.getInstance().soundEffectsVolume++
          setGameSettings(
            "soundEffectsVolume",
            SoundSingleton.getInstance().musicVolume,
          )

          this.soundEffectsVolumeText.setText(
            SoundSingleton.getInstance().soundEffectsVolume.toString(),
          )

          if (SoundSingleton.getInstance().soundEffectsVolume === 10) {
            this.soundEffectsVolumeText.setX(-panel.width + 28)
          }
        }
      })
  }
}
