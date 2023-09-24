import Projectile, {ProjectileType} from "../projectile.js";
import Vector2 from "../vector2.js";
import Enemy from "./enemy.js";

export default class Midwit extends Enemy {
  private currentTime: number = 0;

  protected start() {
    this.life = 10;
  }

  protected innerUpdate(delta: number) {
    this.currentTime += delta;
    if (this.currentTime >= 0.5) {
      this.context.createProjectile(new Projectile({
        type: ProjectileType.PLAYER,
        radius: 2,
        damage: 2,
        position: Vector2.from(0, 0),
        velocity: Vector2.from(100, 50),
        timeToExpire: 10,
      }));
      this.currentTime = 0;
    }
  }
}
