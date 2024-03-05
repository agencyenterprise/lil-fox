import GameUI from "@/scenes/GameUI";
import { centerVH } from "@/utils/Utils";
import InventoryGridFactory from "./InventoryGridFactory";
import InventoryWindowManager from "../managers/InventoryWindowManager";
import Sizer from "phaser3-rex-plugins/templates/ui/sizer/Sizer";

export class InventoryWindowFactory {
  static create(scene: GameUI): Sizer {
    const backgroundImg = scene.add.image(0, 0, "A_INVENTORY", "Inventory.png")
    const inventoryWindow = scene.rexUI.add.sizer({
      width: backgroundImg.width,
      height: backgroundImg.height,
      orientation: "y",
    })

    inventoryWindow.setScale(0.35, 0.35)

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

    return inventoryWindow
  }
}