import { ComponentConstructor, World } from "ecsy";
import { GameEntity } from "./GameEntity";
import { components } from "./items/components/Components";

export default function initializeWorld() {
  const world = new World({ entityClass: GameEntity });

  Object.values(components).forEach((component) => {
    world.registerComponent(component as ComponentConstructor<any>);
  });

  return world;
}
