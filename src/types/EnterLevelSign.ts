import { getWonLevels } from "@/utils/localStorageUtils";
import Sign from "./Sign";

export default class EnterLevelSign extends Sign {
  private levelNumber?: number

  constructor(x: number, y: number, messages: string[], levelNumber: number) {
    super(x, y, messages)

    this.levelNumber = levelNumber
  }


  handleInteraction(): void {
    const wonLevels = getWonLevels()
    if (this.levelNumber && wonLevels.includes(this.levelNumber)) {
      this.showMessage("Level already won.")
      return
    }

    if (this.interactionCount < this.messages.length)
      this.showMessage(this.messages[this.interactionCount])

    this.interactionCount++

    if (this.interactionCount === this.messages.length + 1) {
      this.interactionCount = 0
      this.hideDialog()
    }
  }
}