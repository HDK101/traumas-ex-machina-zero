import Projectile, {ProjectileConstructor} from "../projectile.js";
import {Player} from "../types.js";
import Vector2 from "../vector2.js";

interface Context {
  createProjectile: (projectile: Projectile) => void;
  getPlayers: () => Player[];
}

interface EnemyConstructorParam {
  position: Vector2;
}

export default abstract class Enemy {
  position: Vector2;
  velocity: Vector2 = Vector2.from(0, 0);

  private currentLife: number = 1;

  constructor({
    position,
  }: EnemyConstructorParam, protected readonly context: Context) {
    this.position = position;
  }

  public update(delta: number) {
    this.move(delta);
    this.innerUpdate(delta);
  }

  public get isDead(): boolean {
    return this.currentLife <= 0;
  }

  public damage(value: number) {
    this.currentLife -= value;
  }

  protected abstract start(): void;

  protected abstract innerUpdate(delta: number): void;
  
  protected set life(value: number) {
    this.currentLife = value;
  }

  private move(delta: number) {
    this.position.sum(this.velocity.multiply(delta));
  }
}
