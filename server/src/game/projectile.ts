import Vector2 from "./vector2";

export interface Projectile {
  radius: number;
  damage: number;
  position: Vector2;
  velocity: Vector2;
}
