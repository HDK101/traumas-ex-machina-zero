import Projectile, { ProjectileGroup, ProjectileType } from "../projectile/projectile.js";
import Weapon from "./weapon.js";
class SMG extends Weapon {
    rateInSeconds() {
        return 0.1;
    }
    innerShoot({ position, target }) {
        this.projectiles.create(new Projectile({
            radius: 16,
            damage: 2,
            position: position,
            velocity: position.direction(target),
            speed: 600,
            timeToExpire: 10,
            type: ProjectileType.SMG,
            group: ProjectileGroup.PLAYER,
            onKill: this.onKill
        }));
    }
}
export { SMG as default };
