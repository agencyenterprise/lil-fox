import Phaser from "phaser";

import { Events, sceneEvents } from "../events/EventsCenter";
import SettingsMenu from "./SettingsMenu";
import { Dialog } from "@/ui/Dialog";
import { Tip } from "@/ui/Tip";
import { CharacterDiedDialog } from "@/ui/CharacterDiedDialog";
import { Singleton } from "@/utils/GlobalAccessSingleton";

export default class GameUI extends Phaser.Scene {
  private settingsMenu!: SettingsMenu;

  private hearts: Phaser.GameObjects.Group;
  private berries: Phaser.GameObjects.Group;
  private dialogUi: Dialog;
  private characterDiedDialog: CharacterDiedDialog;
  private tipUi: Tip;

  private shouldHideTip: boolean = false;

  private gameOverSound:
    | Phaser.Sound.NoAudioSound
    | Phaser.Sound.HTML5AudioSound
    | Phaser.Sound.WebAudioSound;
  private pickupSound:
    | Phaser.Sound.NoAudioSound
    | Phaser.Sound.HTML5AudioSound
    | Phaser.Sound.WebAudioSound;

  constructor() {
    super("game-ui");
  }

  create() {
    this.dialogUi = new Dialog(this, 310);
    this.characterDiedDialog = new CharacterDiedDialog(this);
    this.tipUi = new Tip(this);
    this.settingsMenu = new SettingsMenu(this);

    const { width } = this.scale;
    const settingsButton = this.add
      .image(width - 5, 5, "small-button")
      .setScale(0.5)
      .setOrigin(1, 0);
    this.add
      .image(width - 7, 4.5, "gear")
      .setScale(0.35)
      .setOrigin(1, 0);

    settingsButton
      .setInteractive()
      .on(Phaser.Input.Events.POINTER_OVER, () => {
        settingsButton.setTint(0xdedede);
      })
      .on(Phaser.Input.Events.POINTER_OUT, () => {
        settingsButton.setTint(0xffffff);
      })
      .on(Phaser.Input.Events.POINTER_DOWN, () => {
        settingsButton.setTint(0x8afbff);
      })
      .on(Phaser.Input.Events.POINTER_UP, () => {
        settingsButton.setTint(0xffffff);

        if (this.settingsMenu.isOpen) {
          this.settingsMenu.hide();
          this.scene.resume("LilFox");
        } else {
          this.settingsMenu.show();
          this.scene.pause("LilFox");
        }
      });

    this.hearts = this.add.group({
      classType: Phaser.GameObjects.Image,
    });
    this.berries = this.add.group({
      classType: Phaser.GameObjects.Image,
    });

    this.hearts.createMultiple({
      key: "ui-heart-full",
      setXY: {
        x: 10,
        y: 10,
        stepX: 16,
      },
      quantity: 5,
    });

    this.berries.createMultiple({
      key: "berry-empty",
      setXY: {
        x: 10,
        y: 25,
        stepX: 16,
      },
      quantity: 5,
    });

    this.gameOverSound = this.sound.add("audio-game-over", {
      volume: 0.5,
    });

    this.pickupSound = this.sound.add("audio-pickup", {
      volume: 0.5,
    });

    sceneEvents.on(
      Events.PLAYER_HEALTH_CHANGED,
      this.handlePlayerHealthChanged,
      this
    );
    sceneEvents.on(
      Events.PLAYER_COLLECTED_BERRY,
      this.handlePlayerCollectedBerry,
      this
    );
    sceneEvents.on(Events.SHOW_DIALOG, this.showDialog, this);
    sceneEvents.on(Events.SHOW_TIP, this.showTip, this);
    sceneEvents.on(Events.CHARACTER_DIED, this.handleCharacterDied, this);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      sceneEvents.off(
        Events.PLAYER_COLLECTED_BERRY,
        this.handlePlayerCollectedBerry,
        this
      );
      sceneEvents.off(
        Events.PLAYER_HEALTH_CHANGED,
        this.handlePlayerHealthChanged,
        this
      );
      sceneEvents.off(
        Events.SHOW_DIALOG,
        () => this.dialogUi.hideDialogModal(),
        this
      );
      sceneEvents.off(Events.CHARACTER_DIED, this.handleCharacterDied, this);

      this.gameOverSound.removeAllListeners("start");
      this.gameOverSound.removeAllListeners("complete");
    });
  }

  handlePlayerHealthChanged(health: number) {
    // @ts-ignore
    this.hearts.children.each((go, idx) => {
      const heart = go as Phaser.GameObjects.Image;

      if (idx < health) {
        heart.setTexture("ui-heart-full");
      } else {
        heart.setTexture("ui-heart-empty");
      }
    });
  }

  handlePlayerCollectedBerry(collectedBerrys: number) {
    if (Singleton.getInstance().soundEffectsEnabled) {
      this.pickupSound.play({
        volume: Singleton.getInstance().soundEffectsVolume / 10,
      });
    }

    // @ts-ignore
    this.berries.children.each((go, idx) => {
      const berry = go as Phaser.GameObjects.Image;

      if (idx < collectedBerrys) {
        berry.setTexture("berry");
      } else {
        berry.setTexture("berry-empty");
      }
    });
  }

  showDialog(messages: string[]) {
    if (this.dialogUi.isAnimationPlaying) return;

    if (this.dialogUi.isVisible && !this.dialogUi.moreMessagesToShow) {
      this.dialogUi.hideDialogModal();
      sceneEvents.emit(Events.LOCK_PLAYER_MOVEMENT, false);
      this.shouldHideTip = false;
      return;
    }

    if (this.dialogUi.isVisible && this.dialogUi.moreMessagesToShow) {
      this.tipUi.hideTip();
      this.dialogUi.showNextMessage();
      sceneEvents.emit(Events.LOCK_PLAYER_MOVEMENT, true);
      return;
    }

    this.dialogUi.hideDialogModal();
    this.tipUi.hideTip();
    this.dialogUi.showDialogModal(messages);
    sceneEvents.emit(Events.LOCK_PLAYER_MOVEMENT, true);
    this.shouldHideTip = true;
  }

  showTip() {
    if (this.shouldHideTip) return;
    this.tipUi.showTip();
  }

  handleCharacterDied() {
    sceneEvents.emit(Events.STOP_MUSIC);

    if (Singleton.getInstance().soundEffectsEnabled) {
      this.gameOverSound.play({
        volume: Singleton.getInstance().soundEffectsVolume / 10,
      });
    }

    this.characterDiedDialog.showDialogModal();
  }
}
