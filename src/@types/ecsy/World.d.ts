import { Component } from "ecsy";
import { GameEntity } from "../../GameEntity";

declare module "ecsy" {
  interface EntityManager {
    createEntity(id: string): GameEntity;
    getEntityByName(id: string): GameEntity;
    removeEntity(entity: GameEntity);
    queryComponents(Components: Component<any>[]);
  }

  interface World {
    entityManager: EntityManager;
  }

  interface Entity {
    name: string;
  }
}
