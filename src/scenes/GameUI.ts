import Phaser from "phaser";

import { Events, sceneEvents } from "../events/EventsCenter";
import SettingsMenu from "./SettingsMenu";
import { Dialog } from "@/ui/Dialog";
import { Tip } from "@/ui/Tip";

export default class GameUI extends Phaser.Scene {

  private settingsMenu!: SettingsMenu

  private hearts: Phaser.GameObjects.Group
  private berries: Phaser.GameObjects.Group
  private dialogUi: Dialog
  private tipUi: Tip

  constructor() {
    super("game-ui");
  }

  create() {
    this.dialogUi = new Dialog(this, 310)
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
      key: 'berry',
      setXY: {
        x: 10,
        y: 25,
        stepX: 16
      },
      quantity: 5
    })


    sceneEvents.on(Events.PLAYER_HEALTH_CHANGED, this.handlePlayerHealthChanged, this)
    sceneEvents.on(Events.PLAYER_HUNGER_CHANGED, this.handlePlayerHungerChanged, this)
    sceneEvents.on(Events.SHOW_DIALOG, this.showDialog, this)
    sceneEvents.on(Events.SHOW_TIP, this.showTip, this)

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      sceneEvents.off(Events.PLAYER_HUNGER_CHANGED, this.handlePlayerHungerChanged, this)
      sceneEvents.off(Events.PLAYER_HEALTH_CHANGED, this.handlePlayerHealthChanged, this)
      sceneEvents.off(Events.SHOW_DIALOG, () => this.dialogUi.hideDialogModal(), this)
    })


    // const padding = 90
    // const width = 1280 - padding * 2
    // const height = 124

    // const panel = this.add.rectangle(
    //   0,
    //   0,
    //   width,
    //   height,
    //   0xede4f3,
    //   0.9
    // ).setOrigin(0)
    //   .setStrokeStyle(8, 0x905ac2, 1)
    // const c = this.add.container(0, 0, [panel])

    // c.setPosition(0, 0)
    // c.setAlpha(1)



    // const width = this.scale.width
    // const settingsButton = this.add.image(width - 20, 20, 'small-button').setScale(0.7)
    // console.log({
    //   posx: settingsButton.x - settingsButton.width * 0.5,
    //   posy: settingsButton.y + settingsButton.height * 0.5
    // })
    // this.add.image(settingsButton.x - settingsButton.width * 0.05, settingsButton.y + settingsButton.height * 0.02, 'gear').setScale(0.5)
    // // settingsButton.setVisible(false)

    // settingsButton.setInteractive()
    //   .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
    //     settingsButton.setTint(0xdedede)
    //   })
    //   .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
    //     settingsButton.setTint(0xffffff)
    //   })
    //   .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
    //     console.log("OIII")
    //     settingsButton.setTint(0x8afbff)
    //   })
    //   .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
    //     settingsButton.setTint(0xffffff)
    //   })
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

  handlePlayerHungerChanged(hunger: number) {
    // @ts-ignore
    this.berries.children.each((go, idx) => {
      const berry = go as Phaser.GameObjects.Image

      if (idx < hunger) {
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
}