import Phaser from "phaser";

import { sceneEvents } from "../events/EventsCenter";
import SettingsMenu from "./SettingsMenu";

export default class GameUI extends Phaser.Scene {

  private settingsMenu!: SettingsMenu

  private hearts: Phaser.GameObjects.Group
  private berries: Phaser.GameObjects.Group

  constructor() {
    super("game-ui");
  }

  create() {
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


    sceneEvents.on('player-health-changed', this.handlePlayerHealthChanged, this)
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      sceneEvents.off('player-health-changed', this.handlePlayerHealthChanged, this)
    })

    sceneEvents.on('player-hunger-changed', this.handlePlayerHungerChanged, this)
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      sceneEvents.off('player-hunger-changed', this.handlePlayerHungerChanged, this)
    })


    const width = this.scale.width



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
}