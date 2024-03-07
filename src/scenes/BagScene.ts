import Phaser from "phaser"

import { Events, sceneEvents } from "../events/EventsCenter"
import SettingsMenu from "./SettingsMenu"
import { Dialog } from "@/ui/Dialog"
import { Tip } from "@/ui/Tip"
import { SoundSingleton, SoundEffects } from "@/utils/SoundSingleton"
import { GameOverModal } from "@/ui/GameOverModal"
import { WinMarioLikeLevelModal } from "@/ui/WinMarioLikeLevelModal"
import { Modal, ReceivesInstructions } from "@/types/Modal"

export default class BagScene extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys

  private hearts: Phaser.GameObjects.Group
  private berries: Phaser.GameObjects.Group
  private coinAmountText: Phaser.GameObjects.Text
  private timeDownText: Phaser.GameObjects.Text
  public dialogUi: Dialog
  private gameOverModal: GameOverModal
  private winMarioLikeLevelModal: WinMarioLikeLevelModal
  private tipUi: Tip
  private currentOpenModal?: Modal
  private coinImage: Phaser.GameObjects.Image

  private shouldHideTip: boolean = false

  constructor() {
    super("bag-scene")
  }

  preload() {
    this.cursors = this.input.keyboard?.createCursorKeys()!
  }

  create() {
  }

  update() {
    if ((!this.currentOpenModal || !this.currentOpenModal.isVisible) && !this.dialogUi.isVisible) return

    const instructionReceiver: ReceivesInstructions = this.currentOpenModal?.isVisible
      ? this.currentOpenModal
      : this.dialogUi

    const leftDown = Phaser.Input.Keyboard.JustDown(this.cursors.left)
    const rightDown = Phaser.Input.Keyboard.JustDown(this.cursors.right)
    const upDown = Phaser.Input.Keyboard.JustDown(this.cursors.up)
    const downDown = Phaser.Input.Keyboard.JustDown(this.cursors.down)
    const spaceDown = Phaser.Input.Keyboard.JustDown(this.cursors.space)

    if (leftDown) {
      instructionReceiver.leftDown()
    } else if (rightDown) {
      instructionReceiver.rightDown()
    } else if (upDown) {
      instructionReceiver.upDown()
    } else if (downDown) {
      instructionReceiver.downDown()
    } else if (spaceDown) {
      instructionReceiver.select()
    }
  }

  handlePlayerHealthChanged(health: number) {
    // @ts-ignore
    this.hearts.children.each((go, idx) => {
      const heart = go as Phaser.GameObjects.Image

      if (idx < health) {
        heart.setTexture("ui-heart-full")
      } else {
        heart.setTexture("ui-heart-empty")
      }
    })
  }

  handlePlayerCollectedBerry(collectedBerries: number) {
    SoundSingleton.getInstance().playSoundEffect(SoundEffects.PICKUP)

    // @ts-ignore
    this.berries.children.each((go, idx) => {
      const berry = go as Phaser.GameObjects.Image

      if (idx < collectedBerries) {
        berry.setTexture("berry")
      } else {
        berry.setTexture("berry-empty")
      }
    })
  }

  handlePlayerCollectedCoin(amount: number) {
    SoundSingleton.getInstance().playSoundEffect(SoundEffects.PICKUP_COIN)

    this.coinAmountText.setText(`x${amount}`)
  }

  public showDialog(message: string) {
    this.tipUi.hideTip()
    this.dialogUi.showMessage(message)
    sceneEvents.emit(Events.LOCK_PLAYER_MOVEMENT, true)
    this.shouldHideTip = true
  }

  public hideDialog() {
    this.dialogUi.hideDialogModal()
    sceneEvents.emit(Events.LOCK_PLAYER_MOVEMENT, false)
    this.shouldHideTip = false
  }

  showTip() {
    if (this.shouldHideTip) return
    this.tipUi.showTip()
  }

  handleGameOver(message1: string, message2: string) {
    sceneEvents.emit(Events.STOP_MUSIC)
    SoundSingleton.getInstance().playSoundEffect(SoundEffects.GAME_OVER)

    this.currentOpenModal = this.gameOverModal
    this.gameOverModal.showModal({ message1, message2 })
  }

  handleWinMarioLikeLevel() {
    sceneEvents.emit(Events.STOP_MUSIC)
    SoundSingleton.getInstance().playSoundEffect(SoundEffects.SUCCESS)

    this.currentOpenModal = this.winMarioLikeLevelModal
    this.winMarioLikeLevelModal.showModal()
  }

  updateTimer(nextTime: number) {
    this.timeDownText.setText(`00:${nextTime}`)
  }

  handleCharacterDied() {
    this.gameOverModal.showModal({ message1: "Game Over!", message2: "You died!" })
  }

  handleMarioLikeLevelStarted() {
    SoundSingleton.getInstance().playTheme(SoundEffects.THEME_PLATFORM)

    this.berries.setVisible(false)
    this.hearts.setVisible(false)
    this.timeDownText.setVisible(true)
    this.coinAmountText.setVisible(true)
    this.coinImage.setVisible(true)
  }

  handleMarioLikeLevelFinished() {
    SoundSingleton.getInstance().playTheme(SoundEffects.THEME)

    this.berries.setVisible(true)
    this.hearts.setVisible(true)
    this.timeDownText.setVisible(false)
    this.coinAmountText.setVisible(false)
    this.coinImage.setVisible(false)
  }
}
