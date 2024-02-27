import OverlapSizer from "phaser3-rex-plugins/templates/ui/overlapsizer/OverlapSizer";
import GameUI from "@/scenes/GameUI.js";
import InventoryGridSlot from "./InventoryGridSlot";
import { InventoryGridContext } from "../InventoryGridContext";

export default class InventoryGridSlotFactory {
  static create(
    scene: GameUI,
    amount: number,
    createSlotSprite: (scene: GameUI) => OverlapSizer
  ) {
    const slots = [];

    for (let i = 0; i < amount; i++) {
      const slotSprite = createSlotSprite(scene);

      const slot = new InventoryGridSlot(slotSprite, InventoryGridContext.inventory);

      // slot.registerManagers(
      //   new InventoryGridSlotPointerEventManager(scene, slot),
        // new InventoryPointerEventManager(scene, slot),
        // new InventoryGridSlotItemManager(scene, slot),
        // new InventoryGridSlotDragManager(scene, slot, getValidDropTarget),
        // new InventoryItemTooltipManager(scene, slot)
      // );

      slots.push(slot);
    }

    return slots;
  }
}