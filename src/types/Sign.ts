import GameUI from "@/scenes/GameUI";
import Interactable from "./Interactable";
import { Singleton } from "@/utils/GlobalAccessSingleton";

export default class Sign implements Interactable {

  public x: number = 0;
  public y: number = 0;
  public messages: string[]
  public hasPlayerInteracted: boolean = false;
  public interactionCount: number = 0;

  constructor(x: number, y: number, messages: string[]) {
    this.x = x
    this.y = y
    this.messages = messages
  }

  handleInteraction(): void {
    this.hasPlayerInteracted = true
    this.interactionCount++

    if (this.interactionCount === this.messages.length + 1) {
      this.interactionCount = 0
      this.hideDialog()
    }
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