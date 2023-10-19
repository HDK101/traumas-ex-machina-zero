import Player from "../player/player";
import Vector2 from "../vector2.js";

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
  speed: number;
  timeToExpire: number;
  type: number;
  group: ProjectileGroup;
  onKill?: () => void;
}

export default class Projectile {
  radius: number;
  damage: number;
  position: Vector2;
  velocity: Vector2;
  speed: number;
  type: ProjectileType;
  group: ProjectileGroup;
  queuedToDeleted: boolean = false;
  onKill?: () => void;

  private timeToExpire = 0.0;

  constructor({
    radius,
    damage,
    position,
    velocity,
    timeToExpire,
    speed,
    type,
    group,
    onKill,
  }: ProjectileConstructor) {
    this.radius = radius;
    this.damage = damage;
    this.position = position.clone();
    this.velocity = velocity.clone();
    this.timeToExpire = timeToExpire;
    this.type = type;
    this.group = group;
    this.speed = speed;
    this.onKill = onKill;
  }

  public update(deltaTime: number) {
    this.position.sum(this.velocity.multiply(deltaTime * this.speed));
    this.timeToExpire -= deltaTime;

    return {
      queuedToDeleted: this.queuedToDeleted,
      expired: this.timeToExpire <= 0,
    };
  }

  public hit(): void {
    this.queuedToDeleted = true;
  }

  public isQueuedToDelete(): boolean {
    return this.queuedToDeleted;
  }

  get squaredRadius() {
    return Math.pow(this.radius, 2);
  }
}
