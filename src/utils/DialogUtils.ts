import GameUI from "@/scenes/GameUI"
import { Singleton } from "./GlobalAccessSingleton"

export const isTextAnimationBeingPlayed = () => {
  const gameUi: GameUI = Singleton.getInstance().gameUi
  return gameUi.dialogUi.isAnimationPlaying
}