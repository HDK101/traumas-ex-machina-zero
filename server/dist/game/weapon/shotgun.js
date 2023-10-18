import Projectile, { ProjectileGroup, ProjectileType } from "../projectile/projectile.js";
import Vector2 from "../vector2.js";
import Weapon from "./weapon.js";
class Shotgun extends Weapon {
    rateInSeconds() {
        return 0.8;
    }
    createTransformFromDirection(position, target) {
        const direction = position.direction(target);
        const radDifference = Math.PI / 2;
        const calculatedRad = Math.atan2(direction.y, direction.x);
        const directionFar = position.plus(direction.multiply(4));
        const leftRad = calculatedRad - radDifference;
        const rightRad = calculatedRad + radDifference;
        const leftDirectionFar = directionFar.plus(this.calculateDirectionByAngle(leftRad));
        const rightDirectionFar = directionFar.plus(this.calculateDirectionByAngle(rightRad));
        const leftDirection = position.direction(leftDirectionFar);
        const rightDirection = position.direction(rightDirectionFar);
        return {
            center: direction,
            left: leftDirection,
            right: rightDirection
        };
    }
    calculateDirectionByAngle(angle) {
        return Vector2.from(Math.cos(angle), Math.sin(angle));
    }
    innerShoot({ position, target }) {
        const { center, left, right } = this.createTransformFromDirection(position, target);
        this.projectiles.create(new Projectile({
            radius: 16,
            damage: 2,
            position: position,
            velocity: center,
            speed: 800,
            timeToExpire: 10,
            type: ProjectileType.SHOTGUN,
            group: ProjectileGroup.PLAYER
        }));
        this.projectiles.create(new Projectile({
            radius: 16,
            damage: 2,
            position: position.clone(),
            velocity: left,
            speed: 800,
            timeToExpire: 10,
            type: ProjectileType.SHOTGUN,
            group: ProjectileGroup.PLAYER
        }));
        this.projectiles.create(new Projectile({
            radius: 16,
            damage: 2,
            position: position.clone(),
            velocity: right,
            speed: 800,
            timeToExpire: 10,
            type: ProjectileType.SHOTGUN,
            group: ProjectileGroup.PLAYER
        }));
    }
}
export { Shotgun as default };
