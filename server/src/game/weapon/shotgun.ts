import Projectile, {ProjectileGroup, ProjectileType} from "../projectile/projectile.js";
import Vector2 from "../vector2.js";
import Weapon, {ShootParam} from "./weapon.js";

export default class Shotgun extends Weapon {
  public rateInSeconds() {
    return 1.2;
  }

  private createTransformFromDirection(direction: Vector2) {
    const radDifference = Math.PI / 2;
    const calculatedRad = Math.atan2(direction.y, direction.x);
    const calculatedFarDirection = direction.multiply(10);

    const leftRad = calculatedRad - radDifference;
    const rightRad = calculatedRad + radDifference;

    const leftDirection = this.calculateDirectionByAngle(leftRad).multiply(4);
    const rightDirection = this.calculateDirectionByAngle(rightRad).multiply(4);

    leftDirection.sum(calculatedFarDirection);
    rightDirection.sum(calculatedFarDirection);

    for (let i = 0; i <= 100; i++) {
      console.log(leftDirection.lerp(rightDirection, (i / 100)));
    }
  }

  private calculateDirectionByAngle(angle: number) {
    return Vector2.from(Math.cos(angle), Math.sin(angle));
  }

  protected innerShoot({ position, target }: ShootParam): void {
    this.createTransformFromDirection(position.direction(target));

    this.projectiles.create(new Projectile({
      radius: 16,
      damage: 2,
      position: position,
      velocity: position.direction(target),
      speed: 800,
      timeToExpire: 10,
      type: ProjectileType.SMG,
      group: ProjectileGroup.PLAYER,
    }));
  }
}
