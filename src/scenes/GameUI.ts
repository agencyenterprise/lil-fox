import Phaser from "phaser";

import { sceneEvents } from "../events/EventsCenter";

export default class GameUI extends Phaser.Scene {

  private hearts: Phaser.GameObjects.Group
  private berries: Phaser.GameObjects.Group

  constructor() {
    super("game-ui");
  }

  create() {
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