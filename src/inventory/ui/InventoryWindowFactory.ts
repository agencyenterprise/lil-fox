import GameUI from "@/scenes/GameUI";
import { centerVH } from "@/utils/Utils";
import InventoryGridFactory from "./InventoryGridFactory";
import InventoryWindowManager from "../managers/InventoryWindowManager";

export class InventoryWindowFactory {
  static create(scene: GameUI) {
    const backgroundImg = scene.add.image(0, 0, "A_INVENTORY", "Inventory.png")
    const inventoryWindow = scene.rexUI.add.sizer({
      width: backgroundImg.width / 7,
      height: backgroundImg.height / 7,
      orientation: "y",
    })

    inventoryWindow.addBackground(backgroundImg)

    centerVH(inventoryWindow)

    inventoryWindow.layout()

    const inventoryGridManager = InventoryGridFactory.create(scene)

    inventoryWindow.add(inventoryGridManager.grid, {
      padding: {
        left: 15,
        right: 15,
        top: 68,
      },
      expand: false
    })

    inventoryWindow.layout()

    const inventoryWindowManager = new InventoryWindowManager(scene, inventoryGridManager)
  }
}