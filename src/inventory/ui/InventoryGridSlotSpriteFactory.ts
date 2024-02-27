import GameUI from "@/scenes/GameUI";

export default class InventoryGridSlotSpriteFactory {
  static create(scene: GameUI) {
    const slotSpriteBg = scene.add.image(0, 0, "A_INVENTORY", "InventorySlot.png");

    const slotSprite = scene.rexUI.add.overlapSizer({
      x: 0,
      y: 0,
      width: (slotSpriteBg.displayWidth * 2) / 3,
      height: (slotSpriteBg.displayHeight * 2) / 3,
    });

    slotSprite.addBackground(slotSpriteBg);
    return slotSprite;
  }
}
