import Phaser from "phaser";

import { Events, sceneEvents } from "../events/EventsCenter";
import SettingsMenu from "./SettingsMenu";
import { Dialog } from "@/ui/Dialog";
import { Tip } from "@/ui/Tip";
import { GameOverModal } from "@/ui/GameOverModal";
import { WinMarioLikeLevelModal } from "@/ui/WinMarioLikeLevelModal";
import { Modal } from "@/types/Modal";

export default class GameUI extends Phaser.Scene {

  private settingsMenu!: SettingsMenu

  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys

  private hearts: Phaser.GameObjects.Group
  private berries: Phaser.GameObjects.Group
  private coinAmountText: Phaser.GameObjects.Text
  private timeDownText: Phaser.GameObjects.Text
  private dialogUi: Dialog
  private gameOverModal: GameOverModal
  private winMarioLikeLevelModal: WinMarioLikeLevelModal
  private tipUi: Tip
  private currentOpenModal?: Modal

  private shouldHideTip: boolean = false

  constructor() {
    super("game-ui");
  }

  preload() {
    this.cursors = this.input.keyboard?.createCursorKeys()!;
  }

  create() {
    this.dialogUi = new Dialog(this, 310)
    this.gameOverModal = new GameOverModal(this)
    this.winMarioLikeLevelModal = new WinMarioLikeLevelModal(this)
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
        x: 15,
        y: 25,
        stepX: 16
      },
      quantity: 5
    })

    this.coinAmountText = this.add.text(30, 0, 'x1').setScale(0.8, 0.8).setOrigin(1, 0.45)
    this.add
      .container(this.scale.width - 35, 25)
      .setSize(50, 50)
      .add(this.add.image(0, 0, 'coin'))
      .add(this.coinAmountText)

    this.timeDownText = this.add.text(30, 0, '00:00').setScale(0.8, 0.8).setOrigin(1, 0.45)
    this.add
      .container(this.scale.width - 35, 10)
      .setSize(50, 50)
      .add(this.timeDownText)


    this.hearts.setVisible(false)
    this.berries.setVisible(false)

    sceneEvents.on(Events.PLAYER_HEALTH_CHANGED, this.handlePlayerHealthChanged, this)
    sceneEvents.on(Events.PLAYER_COLLECTED_BERRY, this.handlePlayerCollectedBerry, this)
    sceneEvents.on(Events.PLAYER_COLLECTED_COIN, this.handlePlayerCollectedCoin, this)
    sceneEvents.on(Events.SHOW_DIALOG, this.showDialog, this)
    sceneEvents.on(Events.SHOW_TIP, this.showTip, this)
    sceneEvents.on(Events.GAME_OVER, this.handleGameOver, this)
    sceneEvents.on(Events.HIDE_GAME_OVER_MODAL, () => this.gameOverModal.hideDialogModal(), this)
    sceneEvents.on(Events.WIN_MARIO_LIKE_LEVEL, this.handleWinMarioLikeLevel, this)
    sceneEvents.on(Events.UPDATE_COUNTDOWN_TIMER, this.updateTimer, this)

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      sceneEvents.off(Events.PLAYER_COLLECTED_BERRY, this.handlePlayerCollectedBerry, this)
      sceneEvents.off(Events.PLAYER_COLLECTED_COIN, this.handlePlayerCollectedCoin, this)
      sceneEvents.off(Events.PLAYER_HEALTH_CHANGED, this.handlePlayerHealthChanged, this)
      sceneEvents.off(Events.SHOW_DIALOG, () => this.dialogUi.hideDialogModal(), this)
      sceneEvents.off(Events.GAME_OVER, this.handleGameOver, this)
      sceneEvents.off(Events.WIN_MARIO_LIKE_LEVEL, this.handleWinMarioLikeLevel, this)
    })
  }

  update() {
    if (!this.currentOpenModal) return

    const leftDown = this.cursors.left?.isDown
    const rightDown = this.cursors.right?.isDown
    const upDown = this.cursors.up?.isDown
    const downDown = this.cursors.down?.isDown
    const spaceDown = this.cursors.space?.isDown

    if (leftDown) {
      this.currentOpenModal.leftDown()
    } else if (rightDown) {
      this.currentOpenModal.rightDown()
    } else if (upDown) {
      this.currentOpenModal.upDown()
    } else if (downDown) {
      this.currentOpenModal.downDown()
    } else if (spaceDown) {
      this.currentOpenModal.select()
    }
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

  handlePlayerCollectedBerry(collectedBerries: number) {
    // @ts-ignore
    this.berries.children.each((go, idx) => {
      const berry = go as Phaser.GameObjects.Image

      if (idx < collectedBerries) {
        berry.setTexture('berry')
      } else {
        berry.setTexture('berry-empty')
      }
    })
  }

  handlePlayerCollectedCoin(amount: number) {
    this.coinAmountText.setText(`x${amount}`)
  }

  showDialog(messages: string[]) {
    if (this.dialogUi.isAnimationPlaying) return

    if (this.dialogUi.isVisible && !this.dialogUi.moreMessagesToShow) {
      this.dialogUi.hideDialogModal()
      sceneEvents.emit(Events.LOCK_PLAYER_MOVEMENT, false)
      this.shouldHideTip = false
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
    this.shouldHideTip = true
  }

  showTip() {
    if (this.shouldHideTip) return
    this.tipUi.showTip()
  }

  handleGameOver(message1: string, message2: string) {
    this.gameOverModal.showDialogModal(message1, message2)
  }

  handleWinMarioLikeLevel() {
    this.currentOpenModal = this.winMarioLikeLevelModal
    this.winMarioLikeLevelModal.showDialogModal()
  }

  updateTimer(nextTime: number) {
    this.timeDownText.setText(`00:${nextTime}`)
  }
}