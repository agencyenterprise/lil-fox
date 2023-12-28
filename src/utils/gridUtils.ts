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
  console.log("getTargetPosition")
  console.log({ direction })
  console.log(Direction.DOWN)
  console.log(Direction.UP)
  console.log(Direction.LEFT)
  console.log(Direction.RIGHT)
  
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
