import Vector2 from "./vector2";

export enum ProjectileType {
  PISTOL,
  SHOTGUN,
  SMG,
};

export enum ProjectileGroup {
  PLAYER,
  ENEMY,
}

export interface ProjectileConstructor {
  radius: number;
  damage: number;
  position: Vector2;
  velocity: Vector2;
  timeToExpire: number;
  type: number;
  group: ProjectileGroup;
}


export default class Projectile {
  radius: number;
  damage: number;
  position: Vector2;
  velocity: Vector2;
  type: ProjectileType;
  group: ProjectileGroup;

  private timeToExpire = 0.0;

  constructor({
    radius,
    damage,
    position,
    velocity,
    timeToExpire,
    type,
    group,
  }: ProjectileConstructor) {
    this.radius = radius;
    this.damage = damage;
    this.position = position;
    this.velocity = velocity;
    this.timeToExpire = timeToExpire;
    this.type = type;
    this.group = group;
  }

  public update(deltaTime: number) {
    this.position.sum(this.velocity.multiply(deltaTime));
    this.timeToExpire -= deltaTime;

    return {
      expired: this.timeToExpire <= 0,
    };
  }

  get squaredRadius() {
    return Math.pow(this.radius, 2);
  }
}
