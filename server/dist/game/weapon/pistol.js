import Projectile, { ProjectileGroup, ProjectileType } from "../projectile/projectile.js";
import Weapon from "./weapon.js";
class Pistol extends Weapon {
    rateInSeconds() {
        return 0.5;
    }
    innerShoot({ position, target }) {
        this.projectiles.create(new Projectile({
            radius: 16,
            damage: 2,
            position: position,
            velocity: position.direction(target),
            speed: 600,
            timeToExpire: 10,
            type: ProjectileType.PISTOL,
            group: ProjectileGroup.PLAYER,
            onKill: this.onKill
        }));
    }
}
export { Pistol as default };
