export function centerVH(gameObject: {
  x: number;
  y: number;
  scene: Phaser.Scene;
}) {
  gameObject.x = gameObject.scene.scale.width / 2
  gameObject.y = gameObject.scene.scale.height / 2
}