import Projectiles from "../projectile/projectiles.js";
import Vector2 from "../vector2.js";
import {WeaponList} from "../weapon/weaponList.js";

export default class Player {
  id: number;
  position: Vector2;
  velocity: Vector2;
  life: number = 100;
  projectiles: Projectiles | null;

  readonly speed: number = 300;
  readonly radius: number = 32;

  private weapon: WeaponList;

  constructor({
    id,
    position,
  }: {
    id: number;
    position: Vector2;
  }) {
    this.projectiles = null;
    this.id = id;
    this.position = position;
    this.velocity = Vector2.zero();
    this.weapon = WeaponList.PISTOL;
  }

  public move(delta: number) {
    this.position.sum(this.velocity.multiply(delta));
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
}

