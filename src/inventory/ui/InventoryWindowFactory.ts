import GameUI from "@/scenes/GameUI";
import { centerVH } from "@/utils/Utils";
import InventoryGridFactory from "./InventoryGridFactory";

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

    const inventoryGrid = InventoryGridFactory.create(scene)

    inventoryWindow.add(inventoryGrid, {
      padding: {
        left: 15,
        right: 15,
        top: 68,
      },
      expand: false
    })

    inventoryWindow.layout()
  }
}