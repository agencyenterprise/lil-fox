import { GameEntity } from "@/GameEntity";
import { InventoryEvent, InventoryEventEmitter } from "../events/InventoryEventsEmitter";
import { playerEntity, world } from "@/components/NotInitiatedGame";
import { PickedUp } from "@/components/Components";

export const inventoryEvents = new InventoryEventEmitter();

export const addToInventory = (actor: GameEntity, item: GameEntity) => {
  const mutableInventoryComponent = actor.inventory_mutable;
  const firstAvailableSlot = mutableInventoryComponent.firstAvailableSlot()
  firstAvailableSlot!.addItem(item.entityId.value)

  item.addComponent(PickedUp, {
    slotIndex: firstAvailableSlot?.slotIndex,
  });

  mutableInventoryComponent.items.push(item.entityId.value)
  inventoryEvents.emit(InventoryEvent.ITEM_ADDED, item);
}


export function moveItemToSlot(itemId: string, targetSlotIndex?: number) {
  console.log("moveItemToSlot", itemId, targetSlotIndex)
  const itemEntity = world.entityManager.getEntityByName(itemId) as GameEntity;

  console.log({ playerEntity })
  console.log("playerEntity.inventory_mutable.slots", playerEntity.inventory_mutable.slots)

  const currentSlot = playerEntity.inventory_mutable.slots.find(
    (i) => i.item === itemEntity.entityId.value
  );

  const removedItemId = currentSlot!.removeItem();



  const targetSlot =
    targetSlotIndex !== undefined
      ? playerEntity.inventory_mutable.slots[targetSlotIndex]
      : playerEntity.inventory_mutable.firstAvailableSlot();

    
  console.log({ targetSlot })

  targetSlot?.addItem(removedItemId);
  itemEntity.pickedUp_mutable.slotIndex = targetSlot!.slotIndex;

  inventoryEvents.emit(InventoryEvent.ITEM_MOVED, {
    currentSlotIndex: currentSlot!.slotIndex,
    item: itemEntity,
  });
}