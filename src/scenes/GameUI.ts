import Phaser from "phaser";

import { Events, sceneEvents } from "../events/EventsCenter";
import SettingsMenu from "./SettingsMenu";
import { Dialog } from "@/ui/Dialog";
import { Tip } from "@/ui/Tip";
import { CharacterDiedDialog } from "@/ui/CharacterDiedDialog";

export default class GameUI extends Phaser.Scene {

  private settingsMenu!: SettingsMenu

  private hearts: Phaser.GameObjects.Group
  private berries: Phaser.GameObjects.Group
  private dialogUi: Dialog
  private characterDiedDialog: CharacterDiedDialog
  private tipUi: Tip

  constructor() {
    super("game-ui");
  }

  create() {
    this.dialogUi = new Dialog(this, 310)
    this.characterDiedDialog = new CharacterDiedDialog(this)
    this.tipUi = new Tip(this)
    // this.settingsMenu = new SettingsMenu(this)

    this.hearts = this.add.group({
      classType: Phaser.GameObjects.Image,
    })
    this.berries = this.add.group({
      classType: Phaser.GameObjects.Image,
    })

    this.hearts.createMultiple({
      key: 'ui-heart-full',
      setXY: {
        x: 10,
        y: 10,
        stepX: 16
      },
      quantity: 5
    })

    this.berries.createMultiple({
      key: 'berry-empty',
      setXY: {
        x: 10,
        y: 25,
        stepX: 16
      },
      quantity: 5
    })


    sceneEvents.on(Events.PLAYER_HEALTH_CHANGED, this.handlePlayerHealthChanged, this)
    sceneEvents.on(Events.PLAYER_COLLECTED_BERRY, this.handlePlayerCollectedBerry, this)
    sceneEvents.on(Events.SHOW_DIALOG, this.showDialog, this)
    sceneEvents.on(Events.SHOW_TIP, this.showTip, this)
    sceneEvents.on(Events.CHARACTER_DIED, this.handleCharacterDied, this)


    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      sceneEvents.off(Events.PLAYER_COLLECTED_BERRY, this.handlePlayerCollectedBerry, this)
      sceneEvents.off(Events.PLAYER_HEALTH_CHANGED, this.handlePlayerHealthChanged, this)
      sceneEvents.off(Events.SHOW_DIALOG, () => this.dialogUi.hideDialogModal(), this)
      sceneEvents.off(Events.CHARACTER_DIED, this.handleCharacterDied, this)

    })
  }

  handlePlayerHealthChanged(health: number) {
    // @ts-ignore
    this.hearts.children.each((go, idx) => {
      const heart = go as Phaser.GameObjects.Image

      if (idx < health) {
        heart.setTexture('ui-heart-full')
      } else {
        heart.setTexture('ui-heart-empty')
      }
    })
  }

  handlePlayerCollectedBerry(collectedBerrys: number) {
    // @ts-ignore
    this.berries.children.each((go, idx) => {
      const berry = go as Phaser.GameObjects.Image

      if (idx < collectedBerrys) {
        berry.setTexture('berry')
      } else {
        berry.setTexture('berry-empty')
      }
    })
  }

  showDialog(messages: string[]) {
    if (this.dialogUi.isAnimationPlaying) return

    if (this.dialogUi.isVisible && !this.dialogUi.moreMessagesToShow) {
      this.dialogUi.hideDialogModal()
      sceneEvents.emit(Events.LOCK_PLAYER_MOVEMENT, false)
      return
    }

    if (this.dialogUi.isVisible && this.dialogUi.moreMessagesToShow) {
      this.tipUi.hideTip()
      this.dialogUi.showNextMessage()
      sceneEvents.emit(Events.LOCK_PLAYER_MOVEMENT, true)
      return
    }

    this.dialogUi.hideDialogModal()
    this.tipUi.hideTip()
    this.dialogUi.showDialogModal(messages)
    sceneEvents.emit(Events.LOCK_PLAYER_MOVEMENT, true)
  }

  showTip(show: boolean = true) {
    if (show && !this.tipUi.isVisible && !this.dialogUi.isVisible) {
      this.tipUi.showTip()
    } else if (!show && this.tipUi.isVisible) {
      this.tipUi.hideTip()
    }
  }

  handleCharacterDied() {
    this.characterDiedDialog.showDialogModal()
  }
}