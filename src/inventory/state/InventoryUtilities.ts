import { GameEntity } from "@/GameEntity";
import { InventoryEvent, InventoryEventEmitter } from "../events/InventoryEventsEmitter";
import { playerEntity, world } from "@/components/NotInitiatedGame";
import { PickedUp } from "@/items/components/Components";

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

export function deleteItem(itemId: string) {
  const itemEntity = world.entityManager.getEntityByName(itemId) as GameEntity;

  const currentSlot = playerEntity.inventory_mutable.slots.find(
    (i) => i.item === itemEntity.entityId.value
  );

  currentSlot?.removeItem();

  inventoryEvents.emit(InventoryEvent.ITEM_REMOVED, { currentSlotIndex: currentSlot!.slotIndex });
}


export function moveItemToSlot(itemId: string, targetSlotIndex?: number) {
  console.log("moveItemToSlot", itemId, targetSlotIndex)
  const itemEntity = world.entityManager.getEntityByName(itemId) as GameEntity;

  const currentSlot = playerEntity.inventory_mutable.slots.find(
    (i) => i.item === itemEntity.entityId.value
  );

  const removedItemId = currentSlot!.removeItem();

  const targetSlot =
    targetSlotIndex !== undefined
      ? playerEntity.inventory_mutable.slots[targetSlotIndex]
      : playerEntity.inventory_mutable.firstAvailableSlot();

  targetSlot?.addItem(removedItemId);
  itemEntity.pickedUp_mutable.slotIndex = targetSlot!.slotIndex;

  inventoryEvents.emit(InventoryEvent.ITEM_MOVED, {
    currentSlotIndex: currentSlot!.slotIndex,
    item: itemEntity,
  });

}

export function hideItems() {
  playerEntity.inventory_mutable.slots.forEach((slot) => {
    inventoryEvents.emit(InventoryEvent.HIDE_ITEM, { currentSlotIndex: slot.slotIndex, hide: true });
  });
}

export function showItems() {
  playerEntity.inventory_mutable.slots.forEach((slot) => {
    inventoryEvents.emit(InventoryEvent.HIDE_ITEM, { currentSlotIndex: slot.slotIndex, hide: false });
  });
}