import GameUI from "@/scenes/GameUI";
import InventoryGridManager from "./InventoryGridManager";
import { GameEntity } from "@/GameEntity";
import { InventoryGridSlotEvent } from "../events/InventoryGridSlotEventEmitter";
import { InventoryEvent } from "../events/InventoryEventsEmitter";
import { inventoryEvents, moveItemToSlot } from "../state/InventoryUtilities";
import { decomposeItem, getValidDropTarget } from "../Utils";

export default class InventoryWindowManager {
  constructor(
    private readonly scene: GameUI,
    private readonly playerInventory: InventoryGridManager
  ) {
    inventoryEvents.on(InventoryEvent.ITEM_ADDED, (item: GameEntity) => {
      this.playerInventory.addItem(decomposeItem(item));
    });

    // playerInventory.slots.forEach((slot) => {
    //   slot.events.on(InventoryGridSlotEvent.DRAG_ENDED, (dragEndedProps) => {
    //     console.log("DRAG ENDED")
    //     const { startingSlotIndex, landingSlotIndex } = dragEndedProps;
    //     console.log({ startingSlotIndex, landingSlotIndex })


    //     const currentSlot =
    //       this.playerInventory.getSlotAtIndex(startingSlotIndex);

    //     const item = currentSlot.getItem();

    //     // call game logic
    //     moveItemToSlot(item!.entity.entityId.value, landingSlotIndex);
    //   });

    //   slot.events.on(InventoryGridSlotEvent.DRAG_OVER, (dragOverProps) => {
    //     const { slotIndex } = dragOverProps;
    //     const slot = this.playerInventory.getSlotAtIndex(slotIndex);

    //     if (!slot) return;

    //     const isValidDropTarget = getValidDropTarget(slot!.slotType).includes(
    //       dragOverProps.slotContext
    //     );

    //     if (!isValidDropTarget) return;

    //     slot.handlePointerOver(this.scene.input.activePointer);
    //   });

    //   slot.events.on(InventoryGridSlotEvent.DRAG_LEAVE, (dragLeaveProps) => {
    //     const { slotIndex } = dragLeaveProps;
    //     const slot = this.playerInventory.getSlotAtIndex(slotIndex);

    //     if (!slot) return;

    //     slot!.handlePointerOut(this.scene.input.activePointer);
    //   });
    // });

    inventoryEvents.on(InventoryEvent.ITEM_MOVED, (itemMovedProps) => {
      this.playerInventory.removeItem(itemMovedProps.currentSlotIndex);

      this.playerInventory.addItem(decomposeItem(itemMovedProps.item));
    });
  }
}
