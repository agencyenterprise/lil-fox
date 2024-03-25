import { GameEntity } from "./GameEntity";
import { componentLookup } from "./items/components/ComponentLookup";
import { ComponentTypes } from "./items/components/Components";
import EntityId from "./items/components/EntityId";
import { world } from "./components/NotInitiatedGame";

export interface RawEntity {
  components: ComponentTypes;
  entityID: string;
}

export function initializeEntity(rawEntity: RawEntity): GameEntity {
  const entity = world.createEntity(rawEntity.entityID);

  Object.keys(rawEntity.components).forEach((componentKey) => {
    const component = componentLookup.getComponent(componentKey);
    if (component) {
      entity.addComponent(
        component,
        rawEntity.components[componentKey as keyof ComponentTypes]
      );
    } else {
      // console.log(
      //   `${componentKey} was not registered because it did not exist`
      // );
    }
  });

  entity.addComponent<EntityId>(EntityId, {
    value: rawEntity.entityID,
  });

  return entity as GameEntity;
}
