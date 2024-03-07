import { AddItemConfig } from "../ui/InventoryGridSlot";
import Item from "../ui/Item";

export interface ItemManager {
  addItem(addItemConfig: AddItemConfig): Item;
  updateQuantity(val: number): void;
  hideItem(): void;
  showItem(): void;
  removeItem(): string;
  hasItem(): boolean;
  getItem(): Item | null;
}
