export const TILE_SIZE = 16

export enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
  NONE,
}

export type Coordinate = {
  x: number;
  y: number;
}

export function getTargetPosition(currentPosition: Coordinate, direction: Direction) {
  const targetPosition = { ...currentPosition };
  switch (direction) {
    case Direction.DOWN:
      targetPosition.y += TILE_SIZE;
      break;
    case Direction.UP:
      targetPosition.y -= TILE_SIZE;
      break;
    case Direction.LEFT:
      targetPosition.x -= TILE_SIZE;
      break;
    case Direction.RIGHT:
      targetPosition.x += TILE_SIZE;
      break;
    case Direction.NONE:
      break;
    default:
      throw("Invalid direction")
  }
  return targetPosition;
}
