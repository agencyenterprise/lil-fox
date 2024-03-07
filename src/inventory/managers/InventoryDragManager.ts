import GameUI from "@/scenes/GameUI";
import DragManager from "../core/InventoryManager";
import { InventoryGridContext } from "../InventoryGridContext";
import { InventoryGridSlotEvent } from "../events/InventoryGridSlotEventEmitter";
import Item from "../ui/Item";
import OverlapSizer from "phaser3-rex-plugins/templates/ui/overlapsizer/OverlapSizer";
import InventoryGridSlot from "../ui/InventoryGridSlot";

export default class InventoryGridSlotDragManager implements DragManager {
  constructor(
    private readonly scene: GameUI,
    private readonly itemSlot: InventoryGridSlot,
    private readonly getValidDropTarget: (
      context: InventoryGridContext
    ) => InventoryGridContext[]
  ) {
    this.itemSlot.events.on(InventoryGridSlotEvent.ITEM_ADDED, (item: Item) => {
      item.itemSprite.on(
        "drop",
        (pointer: Phaser.Input.Pointer, itemSlotSprite: OverlapSizer) => {
          console.log("drop", {itemSlotSprite})
          this.handleDragDrop(pointer, itemSlotSprite, item);
        }
      );

      item.itemSprite.on(
        "dragenter",
        (pointer: Phaser.Input.Pointer, itemSlotSprite: OverlapSizer) => {
          this.handleDragEnter(pointer, itemSlotSprite);
        }
      );

      item.itemSprite.on(
        "dragleave",
        (pointer: Phaser.Input.Pointer, itemSlotSprite: OverlapSizer) => {
          this.handleDragLeave(pointer, itemSlotSprite);
        }
      );
    });
  }

  handleDragEnter(pointer: Phaser.Input.Pointer, itemSlotSprite: OverlapSizer) {
    const slotContext = itemSlotSprite.getData("slotType");
    const slotIndex = itemSlotSprite.getData("slotIndex");
    console.log("handleDragEnter", slotIndex)
    if (this.getValidDropTarget(slotContext)) {
      this.itemSlot.events.emit(InventoryGridSlotEvent.DRAG_LEAVE, {
        slotIndex,
        slotContext,
      });
    }
  }

  handleDragLeave(
    _pointer: Phaser.Input.Pointer,
    itemSlotSprite: OverlapSizer
  ) {
    const slotContext = itemSlotSprite.getData("slotType");
    const slotIndex = itemSlotSprite.getData("slotIndex");
    if (this.getValidDropTarget(slotContext)) {
      this.itemSlot.events.emit(InventoryGridSlotEvent.DRAG_OVER, {
        slotIndex,
        slotContext,
      });
    }
  }

  handleDragDrop(
    _pointer: Phaser.Input.Pointer,
    itemSlotSprite: OverlapSizer,
    item: Item
  ) {
    let isValidDropTarget = true;
    isValidDropTarget =
      isValidDropTarget &&
    this.getValidDropTarget(this.itemSlot.slotType).includes(
        itemSlotSprite.getData("slotType")
      );

    // item.handleDrop();

    if (!isValidDropTarget) {
      item.resetPosition();
    }

    console.log("slotType", itemSlotSprite.getData("slotType"))
    console.log("slotIndex", itemSlotSprite.getData("slotIndex"))

    this.itemSlot.events.emit(InventoryGridSlotEvent.DRAG_ENDED, {
      startingSlotContext: this.itemSlot.slotType,
      startingSlotIndex: this.itemSlot.slotIndex,
      landingSlotContext: itemSlotSprite.getData("slotType"),
      landingSlotIndex: itemSlotSprite.getData("slotIndex"),
    });
  }
}
