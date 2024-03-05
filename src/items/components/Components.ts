import Consumable from "./Consumable";
import Descriptor from "./Descriptor";
import EntityId from "./EntityId";
import Inventory from "./Inventory";
import PickedUp from "./PickedUp";
import Quantity from "./Quantity";
import Renderable from "./Renderable";
import Valuable from "./Valuable";

export {
  Consumable,
  Descriptor,
  Inventory,
  PickedUp,
  Quantity,
  Renderable,
  Valuable,
  EntityId,
};

export const components: ComponentTypes = {
  Consumable,
  Descriptor,
  PickedUp,
  Quantity,
  Renderable,
  Valuable,
  Inventory,
  EntityId,
};

export type ComponentTypes = {
  Consumable: typeof Consumable;
  Descriptor: typeof Descriptor;
  PickedUp: typeof PickedUp;
  Quantity: typeof Quantity;
  Renderable: typeof Renderable;
  Valuable: typeof Valuable;
  EntityId: typeof EntityId;
  Inventory: typeof Inventory;
};
