import Projectiles from "../projectile/projectiles.js";
import Vector2 from "../vector2.js";
import Pistol from "../weapon/pistol.js";
import Shotgun from "../weapon/shotgun.js";
import SMG from "../weapon/smg.js";
import Weapon from "../weapon/weapon.js";
import {WeaponList} from "../weapon/weaponList.js";

export default class Player {
  id: number;
  position: Vector2;
  velocity: Vector2;
  life: number = 100;

  shooting: boolean = false;

  target!: Vector2;

  _projectiles!: Projectiles;

  readonly speed: number = 300;
  readonly radius: number = 32;

  private currentWeaponId: number = 1;
  private selectedWeapon: Weapon;
  private pistol: Pistol;
  private shotgun: Shotgun;
  private smg: SMG;

  private weaponAssociation: { [key: number]: Weapon };

  constructor({
    id,
    position,
  }: {
    id: number;
    position: Vector2;
  }) {
    this.id = id;
    this.position = position;
    this.velocity = Vector2.zero();
    this.pistol = new Pistol({
      maxAmmo: 50,
    });
    this.smg = new SMG({
      maxAmmo: 200,
    });

    this.shotgun = new Shotgun({
      maxAmmo: 50,
    });
    this.selectedWeapon = this.pistol;

    this.weaponAssociation = {
      1: this.pistol,
      2: this.smg,
      3: this.shotgun,
    };
  }

  public update(deltaTime: number) {
    if (this.shooting) {
      this.selectedWeapon.shoot({
        position: this.position.clone(),
        target: this.target.clone(),
      });
    }

    this.move(deltaTime);

    this.selectedWeapon.update(deltaTime);
  }

  public move(deltaTime: number) {
    this.position.sum(this.velocity.multiply(deltaTime));
  }

  public damage(value: number) {
    this.life -= value;
  }

  public formatted() {
    return {
      id: this.id,
      position: this.position,
      velocity: this.velocity,
      radius: this.radius,
    };
  }

  public get squaredRadius() {
    return Math.pow(this.radius, 2);
  }

  public set projectiles(value: Projectiles) {
    this._projectiles = value;

    this.pistol.projectiles = value;
    this.smg.projectiles = value;
    this.shotgun.projectiles = value;
  }

  public get projectiles(): Projectiles {
    return this._projectiles;
  }

  public changeWeapon(weaponId: number) {
    if (this.currentWeaponId == weaponId) return;
    this.currentWeaponId = weaponId;

    this.selectedWeapon = this.weaponAssociation[weaponId];
  }
}

