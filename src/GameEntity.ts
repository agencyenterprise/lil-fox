import { _Entity } from "ecsy";
import {
  Consumable,
  Descriptor,
  PickedUp,
  Quantity,
  Renderable,
  Valuable,
  EntityId,
  Inventory
} from "./items/components/Components";

export class GameEntity extends _Entity {
  get entityId(): EntityId {
    const component = this.getComponent<EntityId>(EntityId);

    if (!component) {
      throw new Error("EntityId does not exist on this entity.");
    }
    return component;
  }

  get pickedUp(): PickedUp {
    const component = this.getComponent<PickedUp>(PickedUp);
    if (!component) {
      throw new Error("PickedUp does not exist on this entity.");
    }
    return component;
  }

  get pickedUp_mutable(): PickedUp {
    const component = this.getMutableComponent<PickedUp>(PickedUp);
    if (!component) {
      throw new Error("PickedUp does not exist on this entity.");
    }
    return component;
  }

  get renderable(): Renderable {
    const component = this.getComponent<Renderable>(Renderable);
    if (!component) {
      throw new Error("Renderable does not exist on this entity.");
    }
    return component;
  }

  get valuable(): Valuable {
    const component = this.getComponent<Valuable>(Valuable);
    if (!component) {
      throw new Error("Valuable does not exist on this entity.");
    }
    return component;
  }

  get quantity(): Quantity {
    const component = this.getComponent<Quantity>(Quantity);
    if (!component) {
      throw new Error("Quantity does not exist on this entity.");
    }
    return component;
  }

  get descriptor(): Descriptor {
    const component = this.getComponent<Descriptor>(Descriptor);
    if (!component) {
      throw new Error("Descriptor does not exist on this entity.");
    }
    return component;
  }

  get consumable(): Consumable {
    const component = this.getComponent<Consumable>(Consumable);
    if (!component) {
      throw new Error("Consumable does not exist on this entity.");
    }
    return component;
  }

  get inventory_mutable(): Inventory {
    const component = this.getMutableComponent<Inventory>(Inventory);
    if (!component) {
      throw new Error("Inventory does not exist on this entity.");
    }
    return component;
  }
}
