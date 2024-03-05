import { GameEntity } from "../../ecs/GameEntity.ts";

export const enum InventoryEvent {
  ITEM_ADDED = "item_added",
  ITEM_MOVED = "item_moved",
  ITEM_REMOVED = "item_removed",
  HIDE_ITEM = "hide_item",
}

export interface ItemMovedProps {
  currentSlotIndex: number;
  item: GameEntity;
}

export interface ItemRemovedProps {
  currentSlotIndex: number;
}

export interface ItemRemovedProps {
  currentSlotIndex: number;
}

export interface HideItemProps {
  currentSlotIndex: number;
  hide: boolean;
}

export interface InventoryEventMap {
  [InventoryEvent.ITEM_ADDED]: GameEntity;
  [InventoryEvent.ITEM_MOVED]: ItemMovedProps;
  [InventoryEvent.ITEM_REMOVED]: ItemRemovedProps;
  [InventoryEvent.HIDE_ITEM]: HideItemProps;
}

export class InventoryEventEmitter extends Phaser.Events.EventEmitter {
  emit<K extends keyof InventoryEventMap>(
    event: K,
    args: InventoryEventMap[K]
  ): boolean {
    return super.emit(event, args);
  }

  on<K extends keyof InventoryEventMap>(
    event: K,
    fn: (args: InventoryEventMap[K]) => void,
    context?: any
  ): this {
    return super.on(event, fn, context);
  }
}
