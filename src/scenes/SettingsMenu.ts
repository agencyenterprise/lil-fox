import Phaser from "phaser";
import { Events, sceneEvents } from "@/events/EventsCenter";
import { Singleton } from "@/utils/GlobalAccessSingleton";

export default class SettingsMenu {
  private container!: Phaser.GameObjects.Container;
  private checkmarkMusic!: Phaser.GameObjects.Image;
  private checkmarkSoundEffects!: Phaser.GameObjects.Image;

  private _opened = false;

  get isOpen() {
    return this._opened;
  }

  constructor(scene: Phaser.Scene) {
    const { width } = scene.scale;

    this.container = scene.add.container(width - 5, 25);
    this.container.setVisible(false);

    const panel = scene.add
      .nineslice(0, 0, "panel", 0, 150, 50, 24, 24)
      .setOrigin(1, 0);

    const toggleMusicButton = scene.add
      .image(-panel.width + 15, 15, "small-button")
      .setScale(0.5);

    this.checkmarkMusic = scene.add
      .image(-panel.width + 15, 15, "checkmark")
      .setScale(0.5);

    const textMusic = scene.add.text(-panel.width + 28, 9, "Music", {
      color: "#000000",
      fontSize: "12px",
    });

    const toggleSoundEffectsButton = scene.add
      .image(-panel.width + 15, 35, "small-button")
      .setScale(0.5);

    this.checkmarkSoundEffects = scene.add
      .image(-panel.width + 15, 35, "checkmark")
      .setScale(0.5);

    const textSoundEffects = scene.add.text(
      -panel.width + 28,
      29,
      "Sound Effects",
      {
        color: "#000000",
        fontSize: "12px",
      }
    );

    this.container.add(panel);
    this.container.add(toggleMusicButton);
    this.container.add(this.checkmarkMusic);
    this.container.add(textMusic);
    this.container.add(toggleSoundEffectsButton);
    this.container.add(this.checkmarkSoundEffects);
    this.container.add(textSoundEffects);

    toggleMusicButton
      .setInteractive()
      .on(Phaser.Input.Events.POINTER_UP, () => {
        this.toggleMusic(scene);
      });

    toggleSoundEffectsButton
      .setInteractive()
      .on(Phaser.Input.Events.POINTER_UP, () => {
        this.toggleSoundEffects(scene);
      });
  }

  show() {
    this.container.setVisible(true);
    this._opened = true;
  }

  hide() {
    this.container.setVisible(false);
    this._opened = false;
  }

  private toggleMusic(scene: Phaser.Scene) {
    if (this.checkmarkMusic.visible) {
      this.checkmarkMusic.setVisible(false);
      sceneEvents.emit(Events.PAUSE_MUSIC);
    } else {
      this.checkmarkMusic.setVisible(true);
      sceneEvents.emit(Events.RESUME_MUSIC);
    }
  }

  private toggleSoundEffects(scene: Phaser.Scene) {
    if (this.checkmarkSoundEffects.visible) {
      this.checkmarkSoundEffects.setVisible(false);
      Singleton.getInstance().soundEffectsEnabled = false;
    } else {
      this.checkmarkSoundEffects.setVisible(true);
      Singleton.getInstance().soundEffectsEnabled = true;
    }
  }
}
