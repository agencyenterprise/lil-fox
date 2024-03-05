import OverlapSizer from "phaser3-rex-plugins/templates/ui/overlapsizer/OverlapSizer";
import { InventoryGridContext } from "../InventoryGridContext";
import { Descriptor, PickedUp, Quantity, Renderable } from "@/components/Components";
import { GameEntity } from "@/GameEntity";
import { PointerEventManager } from "../core/PointerEventManager";
import { ItemManager } from "../core/ItemManager";
import { InventoryGridSlotEvent, InventoryGridSlotEventEmitter } from "../events/InventoryGridSlotEventEmitter";
import DragManager from "../core/InventoryManager";

export interface AddItemConfig {
  renderable: Renderable;
  descriptor: Descriptor;
  pickedUp: PickedUp | undefined;
  quantity: Quantity | undefined;
  entity: GameEntity;
}
export default class InventoryGridSlot {

  private pointerEventManager: PointerEventManager | undefined;
  private itemManager: ItemManager | undefined;
  private dragManager: DragManager | undefined;
  public slotIndex: number = 0;

  public readonly events: InventoryGridSlotEventEmitter =
    new InventoryGridSlotEventEmitter();

  constructor(
    public readonly slotSprite: OverlapSizer,
    public readonly slotType: InventoryGridContext
  ) {
    console.log("constructor InventoryGridSlot", slotType)
    this.slotSprite.setData("slotIndex", this.slotIndex);
    this.slotSprite.setData("slotType", slotType);
  }

  addItem(addItemConfig: AddItemConfig) {
    const item = this.itemManager!.addItem(addItemConfig);

    this.events.emit(InventoryGridSlotEvent.ITEM_ADDED, item);

    this.slotSprite.setData("hasItem", true);

    return item;
  }

  removeItem() {
    this.itemManager!.removeItem();

    this.slotSprite.setData("hasItem", false);
  }

  hideItem() {
    this.itemManager!.hideItem();
  }

  showItem() {
    this.itemManager!.showItem();
  }

  setSlotIndex(index: number) {
    console.log("index", index)
    this.slotIndex = index
  }

  getItem() {
    return this.itemManager?.getItem();
  }

  hasItem() {
    return this.itemManager?.hasItem();
  }

  showItemInfo() {
    // this.itemTooltipManager?.showItemTooltip();
  }

  handlePointerOut(activePointer: Phaser.Input.Pointer) {
    this.pointerEventManager?.handlePointerOut(activePointer);
  }
  handlePointerOver(activePointer: Phaser.Input.Pointer) {
    this.pointerEventManager?.handlePointerOut(activePointer);
  }

  registerManagers(
    pointerEventManager: PointerEventManager,
    itemManager: ItemManager,
    // dragManager: DragManager,
    // itemTooltipManager: ItemTooltipManager
  ) {
    this.pointerEventManager = pointerEventManager;
    this.itemManager = itemManager;
    // this.dragManager = dragManager;
    // this.itemTooltipManager = itemTooltipManager;
  }
}