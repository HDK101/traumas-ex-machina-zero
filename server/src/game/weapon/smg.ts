import Projectile, {ProjectileGroup, ProjectileType} from "../projectile/projectile.js";
import Weapon, {ShootParam} from "./weapon.js";

export default class SMG extends Weapon {
  public rateInSeconds() {
    return 0.2;
  }

  protected innerShoot({ position, target }: ShootParam): void {
    this.projectiles.create(new Projectile({
      radius: 16,
      damage: 2,
      position: position,
      velocity: position.direction(target),
      speed: 600,
      timeToExpire: 10,
      type: ProjectileType.SMG,
      group: ProjectileGroup.PLAYER,
    }));
  }
}
