import Vector2 from "./vector2";

export interface ProjectileConstructor {
  radius: number;
  damage: number;
  position: Vector2;
  velocity: Vector2;
  timeToExpire: number;
}

export default class Projectile {
  radius: number;
  damage: number;
  position: Vector2;
  velocity: Vector2;

  private timeToExpire = 0.0;

  constructor({
    radius,
    damage,
    position,
    velocity,
    timeToExpire,
  }: ProjectileConstructor) {
    this.radius = radius;
    this.damage = damage;
    this.position = position;
    this.velocity = velocity;
    this.timeToExpire = timeToExpire;
  }

  public update(deltaTime: number) {
    this.position.sum(this.velocity.multiply(deltaTime));
    this.timeToExpire -= deltaTime;

    return {
      expired: this.timeToExpire <= 0,
    };
  }
}
