export const TILE_SIZE = 16

export enum Direction {
  UP = "UP",
  DOWN = "DOWN",
  LEFT = "LEFT",
  RIGHT = "RIGHT",
  NONE = "NONE",
}

export type Coordinate = {
  x: number;
  y: number;
}
