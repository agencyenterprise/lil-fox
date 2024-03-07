import Phaser from "phaser"

import { Events, sceneEvents } from "../events/EventsCenter"
import SettingsMenu from "./SettingsMenu"
import { Dialog } from "@/ui/Dialog"
import { Tip } from "@/ui/Tip"
import { SoundSingleton, SoundEffects } from "@/utils/SoundSingleton"
import { GameOverModal } from "@/ui/GameOverModal"
import { WinMarioLikeLevelModal } from "@/ui/WinMarioLikeLevelModal"
import { Modal, ReceivesInstructions } from "@/types/Modal"
import type RexUI from "phaser3-rex-plugins/templates/ui/ui-plugin"
import { InventoryWindowFactory } from "@/inventory/ui/InventoryWindowFactory"
import uiJson from "../../public/inventory/assets/ui.json"
import uiImg from "../../public/inventory/assets/ui.png"
import { getPlayerItems } from "@/prefabs/Player"
import { initializeEntity } from "@/InitializeEntity"
import { addToInventory, deleteItem, hideItems, showItems } from "@/inventory/state/InventoryUtilities"
import { playerEntity } from "@/components/NotInitiatedGame"
import Sizer from "phaser3-rex-plugins/templates/ui/sizer/Sizer"

export default class GameUI extends Phaser.Scene {
  public rexUI: RexUI

  private settingsMenu!: SettingsMenu

  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private iKey!: Phaser.Input.Keyboard.Key

  private hearts: Phaser.GameObjects.Group
  private berries: Phaser.GameObjects.Group
  private timeDownText: Phaser.GameObjects.Text
  public dialogUi: Dialog
  private gameOverModal: GameOverModal
  private winMarioLikeLevelModal: WinMarioLikeLevelModal
  private tipUi: Tip
  private currentOpenModal?: Modal
  private inventoryWindow: Sizer

  private coinAccumulatedAmount: number = 0
  private coinCollectedAmount: number = 0
  private coinAmountText: Phaser.GameObjects.Text
  private coinImage: Phaser.GameObjects.Image

  private shouldHideTip: boolean = false

  constructor() {
    super("game-ui")
  }

  preload() {
    const uiAtlasMeta = uiJson.meta as any
    uiAtlasMeta.image = uiImg

    this.cursors = this.input.keyboard?.createCursorKeys()!
    this.iKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.I)!
  }

  create() {
    this.dialogUi = new Dialog(this, 310)
    this.gameOverModal = new GameOverModal(this)
    this.winMarioLikeLevelModal = new WinMarioLikeLevelModal(this)
    this.tipUi = new Tip(this)
    this.settingsMenu = new SettingsMenu(this)

    const { width } = this.scale
    const settingsButton = this.add
      .image(width - 5, 5, "small-button")
      .setScale(0.5)
      .setOrigin(1, 0)
    this.add
      .image(width - 7, 4.5, "gear")
      .setScale(0.35)
      .setOrigin(1, 0)

    settingsButton
      .setInteractive()
      .on(Phaser.Input.Events.POINTER_OVER, () => {
        settingsButton.setTint(0xdedede)
      })
      .on(Phaser.Input.Events.POINTER_OUT, () => {
        settingsButton.setTint(0xffffff)
      })
      .on(Phaser.Input.Events.POINTER_DOWN, () => {
        settingsButton.setTint(0x8afbff)
      })
      .on(Phaser.Input.Events.POINTER_UP, () => {
        settingsButton.setTint(0xffffff)

        if (this.settingsMenu.isOpen) {
          this.settingsMenu.hide()
          this.scene.resume("LilFox")
        } else {
          this.settingsMenu.show()
          this.scene.pause("LilFox")
        }
      })

    this.hearts = this.add.group({
      classType: Phaser.GameObjects.Image,
    })
    this.berries = this.add.group({
      classType: Phaser.GameObjects.Image,
    })

    this.hearts.createMultiple({
      key: "ui-heart-full",
      setXY: {
        x: 10,
        y: 10,
        stepX: 16,
      },
      quantity: 5,
    })

    this.berries.createMultiple({
      key: "berry-empty",
      setXY: {
        x: 15,
        y: 25,
        stepX: 16,
      },
      quantity: 5,
    })

    this.coinImage = this.add.image(0, 7, "coin").setOrigin(1, 0.5)
    this.coinAmountText = this.add.text(this.coinImage.width + 12, 7, "x0", { fontSize: "12px" }).setOrigin(1, 0.5)
    this.add
      .container(width - settingsButton.width - 20, 8)
      .setSize(50, 50)
      .add(this.coinImage)
      .add(this.coinAmountText)

    this.timeDownText = this.add.text(30, 0, "00:00").setScale(0.8, 0.8).setOrigin(1, 0.45).setVisible(false)
    this.add.container(17, 15).setSize(50, 50).add(this.timeDownText)

    SoundSingleton.getInstance().setSoundManager(this)
    SoundSingleton.getInstance().playTheme(SoundEffects.THEME_GRANDPA)

    this.berries.setVisible(false)
    this.hearts.setVisible(false)
    this.timeDownText.setVisible(false)
    this.coinAmountText.setVisible(false)
    this.coinImage.setVisible(false)

    this.inventoryWindow = InventoryWindowFactory.create(this)

    const playerItems = getPlayerItems()

    // playerItems.forEach((item) => {
    //   const entity = initializeEntity(item as any);
    //   addToInventory(playerEntity, entity);
    // });

    this.hideInventory()

    sceneEvents.on(Events.PLAYER_HEALTH_CHANGED, this.handlePlayerHealthChanged, this)
    sceneEvents.on(Events.PLAYER_COLLECTED_BERRY, this.handlePlayerCollectedBerry, this)
    sceneEvents.on(Events.PLAYER_HEALTH_CHANGED, this.handlePlayerHealthChanged, this)
    sceneEvents.on(Events.PLAYER_COLLECTED_BERRY, this.handlePlayerCollectedBerry, this)
    sceneEvents.on(Events.SHOW_TIP, this.showTip, this)
    sceneEvents.on(Events.CHARACTER_DIED, this.handleCharacterDied, this)
    sceneEvents.on(Events.PLAYER_ACCUMULATED_COIN, this.handlePlayerAccumulatedCoin, this)
    sceneEvents.on(Events.PLAYER_COLLECTED_COIN, this.handlePlayerCollectedCoin, this)
    sceneEvents.on(Events.GAME_OVER, this.handleGameOver, this)
    sceneEvents.on(Events.WIN_MARIO_LIKE_LEVEL, this.handleWinMarioLikeLevel, this)
    sceneEvents.on(Events.UPDATE_COUNTDOWN_TIMER, this.updateTimer, this)
    sceneEvents.on(Events.GRANDPA_POUCH_COLLECTED, this.handleGrandpaLevelPouchCollected, this)
    sceneEvents.on(Events.FOX_GAME_LEVEL_STARTED, this.handleFoxGameLevelStarted, this)
    sceneEvents.on(Events.MARIO_LIKE_LEVEL_STARTED, this.handleMarioLikeLevelStarted, this)
    sceneEvents.on(Events.MARIO_LIKE_LEVEL_FINISHED, this.handleMarioLikeLevelFinished, this)

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      sceneEvents.off(Events.PLAYER_COLLECTED_BERRY, this.handlePlayerCollectedBerry, this)
      sceneEvents.off(Events.PLAYER_HEALTH_CHANGED, this.handlePlayerHealthChanged, this)
      sceneEvents.off(Events.CHARACTER_DIED, this.handleCharacterDied, this)
    })
  }

  update() {
    const iKeyDown = Phaser.Input.Keyboard.JustDown(this.iKey)

    if (iKeyDown) {
      this.handleIKeyDown()
    }

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

  handlePlayerAccumulatedCoin(amount: number) {
    SoundSingleton.getInstance().playSoundEffect(SoundEffects.PICKUP_COIN)

    this.coinAccumulatedAmount += amount
    this.coinAmountText.setText(`x${this.coinAccumulatedAmount}`)
  }

  handlePlayerCollectedCoin(amount: number) {
    SoundSingleton.getInstance().playSoundEffect(SoundEffects.PICKUP_COIN)

    this.coinCollectedAmount = amount
    this.coinAmountText.setText(`x${this.coinCollectedAmount}`)
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
    this.timeDownText.setText(`00:${nextTime.toString().padStart(2, "0")}`)
  }

  handleCharacterDied() {
    this.gameOverModal.showModal({ message1: "Game Over!", message2: "You died!" })
  }

  handleGrandpaLevelPouchCollected() {
    this.coinImage.setVisible(true)
    this.coinAmountText.setVisible(true)
  }

  handleFoxGameLevelStarted() {
    SoundSingleton.getInstance().playTheme(SoundEffects.THEME)

    this.berries.setVisible(true)
    this.hearts.setVisible(true)
    this.timeDownText.setVisible(false)
    this.coinImage.setVisible(true)
    this.coinAmountText.setVisible(true)
  }

  handleMarioLikeLevelStarted() {
    SoundSingleton.getInstance().playTheme(SoundEffects.THEME_PLATFORM)

    this.handlePlayerCollectedCoin(0)

    this.berries.setVisible(false)
    this.hearts.setVisible(false)
    this.timeDownText.setVisible(true)
    this.coinImage.setVisible(true)
    this.coinAmountText.setVisible(true)
  }

  handleMarioLikeLevelFinished() {
    SoundSingleton.getInstance().playTheme(SoundEffects.THEME)

    this.handlePlayerAccumulatedCoin(this.coinCollectedAmount)

    this.berries.setVisible(true)
    this.hearts.setVisible(true)
    this.timeDownText.setVisible(false)
  }

  handleIKeyDown() {
    if (this.inventoryWindow.visible) {
      this.hideInventory()
    } else {
      this.showInventory()
    }
  }

  showInventory() {
    this.inventoryWindow.setVisible(true)
    showItems()
  }

  hideInventory() {
    this.inventoryWindow.setVisible(false)
    hideItems()
  }
}
