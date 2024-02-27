import OverlapSizer from "phaser3-rex-plugins/templates/ui/overlapsizer/OverlapSizer";
import { InventoryGridContext } from "../InventoryGridContext";

export default class InventoryGridSlot {

  public slotIndex: number = 0;

  constructor(public readonly slotSprite: OverlapSizer, public readonly context: InventoryGridContext) {}

  setSlotIndex(index: number) {
    this.slotIndex = index
  }
}