import Projectile, {ProjectileGroup, ProjectileType} from "../projectile/projectile.js";
import Enemy from "./enemy.js";

export default class Midwit extends Enemy {
  private currentTime: number = 0;

  protected start() {
    this.life = 10;
  }

  protected innerUpdate(delta: number) {
    this.currentTime += delta;

    const players = this.context.getPlayers();

    if (players.length > 0) {
      const firstPlayer = players[0];
      if (this.currentTime >= 0.5) {
        this.context.createProjectile(new Projectile({
          type: ProjectileType.PISTOL,
          group: ProjectileGroup.ENEMY,
          radius: 16,
          damage: 2,
          position: this.position.clone(),
          velocity: this.position.direction(firstPlayer.position),
          timeToExpire: 10,
          speed: 300,
        }));
        this.currentTime = 0;
      }
    }
  }
}
