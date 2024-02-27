import Consumable from "./Consumable";
import Descriptor from "./Descriptor";
import PickedUp from "./PickedUp";
import Quantity from "./Quantity";
import Renderable from "./Renderable";
import Valuable from "./Valuable";

export {
  Consumable,
  Descriptor,
//   Inventory,
  PickedUp,
  Quantity,
  Renderable,
  Valuable,
};

export const components: ComponentTypes = {
  Consumable,
  Descriptor,
  PickedUp,
  Quantity,
  Renderable,
  Valuable,
//   Inventory,
};

export type ComponentTypes = {
  Consumable: typeof Consumable;
  Descriptor: typeof Descriptor;
  PickedUp: typeof PickedUp;
  Quantity: typeof Quantity;
  Renderable: typeof Renderable;
  Valuable: typeof Valuable;
//   Inventory: typeof Inventory;
};
