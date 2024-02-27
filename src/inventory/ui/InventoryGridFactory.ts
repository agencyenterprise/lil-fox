import GameUI from "@/scenes/GameUI";
import InventoryGridSlotFactory from "./InventoryGridSlotFactory";
import InventoryGridSlotSpriteFactory from "./InventoryGridSlotSpriteFactory";
import InventoryGridSlot from "./InventoryGridSlot";

export default class InventoryGridFactory {
  static create(scene: GameUI) {
    const slots: InventoryGridSlot[] = InventoryGridSlotFactory.create(
      scene,
      25,
      InventoryGridSlotSpriteFactory.create
    );

    const cols = 5;
    const rows = 5;
    const table = scene.rexUI.add.gridSizer({
      column: cols,
      row: rows,
      space: { column: 0, row: 0 },
    });

    for (let i = 0; i < slots.length; i++) {
      const itemSlot = slots[i];
      const row = i % cols;
      const column = (i - row) / cols;

      const rightPadding = column === cols - 1 ? 5 : 0;
      const bottomPadding = row === rows - 1 ? 5 : 0;

      itemSlot.setSlotIndex(row * cols + column);

      table.add(itemSlot.slotSprite, {
        column: column,
        row: row,
        padding: {
          top: 5,
          right: rightPadding,
          left: 5,
          bottom: bottomPadding,
        },
        key: i.toString(),
        align: "center",
      });
    }

    // We have to sort these because the rexUI plugin adds item slots to the grid column by column, instead of row by row
    // This ensures that slots[index] gives you the correct item slot as if you were counting from left to right
    slots.sort((slotA, slotB) => {
      return slotA.slotIndex - slotB.slotIndex;
    });

    // return new InventoryGridManager(table, slots);
    return table
  }
}