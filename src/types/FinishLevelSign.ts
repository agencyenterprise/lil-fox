import { getWonLevels } from "@/utils/localStorageUtils";
import Sign from "./Sign";
import { Singleton } from "@/utils/GlobalAccessSingleton";

export default class FinishLevelSign extends Sign {
  private levelNumber: number
  private correctAlternative: number

  constructor(x: number, y: number, messages: string[], levelNumber: number, correctAlternative: number) {
    super(x, y, messages)

    this.levelNumber = levelNumber
    this.correctAlternative = correctAlternative
  }


  handleInteraction(): void {
    const wonLevels = getWonLevels()
    if (wonLevels.includes(this.levelNumber)) {
      this.showMessage("Level already won.")
      return
    }

    const scenePlugin = Singleton.getInstance().gameUi.scene
    
    console.log({
      messages: this.messages,
      correctAlternative: this.correctAlternative,
      levelNumber: this.levelNumber,
    })

    scenePlugin.pause("LilFox")
    scenePlugin.launch("QuizScene", {
      messages: [...this.messages],
      correctAlternative: this.correctAlternative,
      levelNumber: this.levelNumber,
    })
  }
}