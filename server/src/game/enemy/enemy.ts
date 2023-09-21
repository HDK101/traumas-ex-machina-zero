import {Projectile} from "../projectile.js";

interface EnemyConstructorParam {
  createProjectile: (projectile: Projectile) => void;
}

export default abstract class Enemy {
  private currentLife: number = 1;

  private createProjectile: (projectile: Projectile) => void = () => {};

  constructor({
    createProjectile,
  }: EnemyConstructorParam) {
    this.createProjectile = createProjectile;
  }

  protected abstract start(): void;

  public abstract update(delta: number): void;

  public get isDead(): boolean {
    return this.currentLife <= 0;
  }
  
  protected set life(value: number) {
    this.currentLife = value;
  }
}
