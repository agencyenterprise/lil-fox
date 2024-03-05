import { GameEntity } from "@/GameEntity";
import { AddItemConfig } from "./ui/InventoryGridSlot";
import PickedUp from "@/items/components/PickedUp";
import Quantity from "@/items/components/Quantity";
import { InventoryGridContext } from "./InventoryGridContext";

export function decomposeItem(item: GameEntity): AddItemConfig {
  return {
    entity: item,
    pickedUp: item.hasComponent(PickedUp) ? item.pickedUp : undefined,
    descriptor: item.descriptor,
    renderable: item.renderable,
    quantity: item.hasComponent(Quantity) ? item.quantity : undefined,
  };
}

export function getValidDropTarget(_context: InventoryGridContext) {
  return [InventoryGridContext.inventory];
}