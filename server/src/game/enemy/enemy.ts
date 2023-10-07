import { CreateProjectile } from "../projectile/projectiles.js";
import { CreateAmmo } from "../ammo/ammos.js";
import Player from "../player/player.js";
import Vector2 from "../vector2.js";
import Ammo from "../ammo/ammo.js";
import {WeaponList} from "../weapon/weaponList.js";

interface Context {
  createProjectile: CreateProjectile;
  getPlayers: () => Player[];
  createAmmo: CreateAmmo;
}

interface EnemyConstructorParam {
  position: Vector2;
}

export default abstract class Enemy {
  position: Vector2;
  velocity: Vector2 = Vector2.from(0, 0);

  public readonly radius = 16;

  private currentLife: number = 100;

  constructor({
    position,
  }: EnemyConstructorParam, protected readonly context: Context) {
    this.position = position;

    this.start();
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

    if (this.currentLife <= 0) {
      this.onDeath();
    }
  }

  public onDeath() {
    this.context.createAmmo(new Ammo(
      this.position.clone(),
      WeaponList.PISTOL,
      Math.round(Math.random() * 10) * 5
    ));
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
