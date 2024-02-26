import GameUI from "@/scenes/GameUI";
import { centerVH } from "@/utils/Utils";

export class InventoryWindowFactory {
  static create(scene: GameUI) {
    const backgroundImg = scene.add.image(0, 0, "A_INVENTORY", "Inventory.png")
    const inventoryWindow = scene.rexUI.add.sizer({
      width: backgroundImg.width / 3,
      height: backgroundImg.height / 3,
      orientation: "y",
    })

    inventoryWindow.addBackground(backgroundImg)

    centerVH(inventoryWindow)

    inventoryWindow.layout()
  }
}