import Player from "../player/player.js";
import Projectiles from "../projectile/projectiles.js";
import Vector2 from "../vector2.js";

export interface WeaponConstructor {
  maxAmmo: number;
  onKill: () => void;
}

export interface ShootParam {
  position: Vector2;
  target: Vector2;
}

export default abstract class Weapon {
  public readonly maxAmmo: number;

  protected position: Vector2;
  protected target: Vector2;

  protected onKill: () => void;

  private _ammo: number;
  private _projectiles!: Projectiles;

  private currentTime: number = 0.0;

  constructor({
    maxAmmo,
    onKill,
  }: WeaponConstructor) {
    this._ammo = maxAmmo;
    this.maxAmmo = maxAmmo;
    this.onKill = onKill;
    this.position = Vector2.zero();
    this.target = Vector2.zero();
  }

  public canShot() {
    return this.ammo > 0 && this.currentTime <= 0;
  }

  public consumeAmmo(quantity: number = 1) {
    this._ammo -= quantity;
    this._ammo = Math.max(this._ammo, 0);
  }

  public replenishAmmo(quantity: number) {
    this._ammo += quantity;
    this._ammo = Math.min(this._ammo, this.maxAmmo);
  }

  public shoot(shootParam: ShootParam) {
    if (!this.canShot()) return;

    this.innerShoot(shootParam);
    this.currentTime = this.rateInSeconds();
    this.consumeAmmo();
  }

  public update(deltaTime: number) {
    this.currentTime -= deltaTime;
  }

  public abstract rateInSeconds(): number;

  public get ammo() {
    return this._ammo;
  }

  public get projectiles() {
    return this._projectiles;
  }
  
  public set projectiles(value: Projectiles) {
    this._projectiles = value;
  }

  protected abstract innerShoot(shootParam: ShootParam): void;
}
