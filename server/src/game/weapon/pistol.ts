import Projectile, {ProjectileGroup, ProjectileType} from "../projectile/projectile.js";
import Weapon, {ShootParam} from "./weapon.js";

export default class Pistol extends Weapon {
  public rateInSeconds() {
    return 0.8;
  }

  protected innerShoot({ position, target }: ShootParam): void {
    console.log("pistol lol");
    this.projectiles.create(new Projectile({
      radius: 16,
      damage: 2,
      position: position,
      velocity: position.direction(target),
      speed: 600,
      timeToExpire: 10,
      type: ProjectileType.PISTOL,
      group: ProjectileGroup.PLAYER,
    }));
  }
}
