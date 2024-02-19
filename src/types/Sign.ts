import GameUI from "@/scenes/GameUI";
import Interactable from "./Interactable";
import { Singleton } from "@/utils/GlobalAccessSingleton";

export default class Sign implements Interactable {

  public x: number = 0;
  public y: number = 0;
  public hasPlayerInteracted: boolean = false;
  public interactionCount: number = 0;

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  handleInteraction(): void {
    this.hasPlayerInteracted = true
    this.interactionCount++
  }

  showMessage(message: string) {
    const gameUi: GameUI = Singleton.getInstance().gameUi
    gameUi.showDialog(message)
  }

  hideDialog() {
    const gameUi: GameUI = Singleton.getInstance().gameUi
    gameUi.hideDialog()
  }
}