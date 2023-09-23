import {Projectile} from "../projectile.js";
import {Player} from "../types.js";

interface Context {
  createProjectile: (projectile: Projectile) => void;
  getPlayers: () => Player[];
}

export default abstract class Enemy {
  private currentLife: number = 1;

  constructor(protected readonly context: Context) {}

  protected abstract start(): void;

  public abstract update(delta: number): void;

  public get isDead(): boolean {
    return this.currentLife <= 0;
  }
  
  protected set life(value: number) {
    this.currentLife = value;
  }
}
