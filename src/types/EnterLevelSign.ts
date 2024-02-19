import { getWonLevels } from "@/utils/localStorageUtils";
import Sign from "./Sign";

export default class EnterLevelSign extends Sign {
  private messages: string[]
  private levelNumber?: number

  constructor(x: number, y: number, messages: string[], levelNumber: number) {
    super(x, y)

    this.levelNumber = levelNumber
    this.messages = messages
  }


  handleInteraction(): void {
    const wonLevels = getWonLevels()
    if (this.levelNumber && wonLevels.includes(this.levelNumber)) {
      this.showMessage("Level already won.")
    } else {
      this.showMessage(this.messages[this.interactionCount])
    }

    super.handleInteraction()
  }

}