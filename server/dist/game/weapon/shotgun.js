import Projectile, { ProjectileGroup, ProjectileType } from "../projectile/projectile.js";
import Vector2 from "../vector2.js";
import Weapon from "./weapon.js";
class Shotgun extends Weapon {
    rateInSeconds() {
        return 1.2;
    }
    createTransformFromDirection(position, target) {
        const direction = position.direction(target);
        const radDifference = Math.PI / 2;
        const calculatedRad = Math.atan2(direction.y, direction.x);
        const calculatedFarDirection = direction.multiply(10);
        const leftRad = calculatedRad - radDifference;
        const rightRad = calculatedRad + radDifference;
        const leftDirection = this.calculateDirectionByAngle(leftRad).multiply(4);
        const rightDirection = this.calculateDirectionByAngle(rightRad).multiply(4);
        leftDirection.sum(calculatedFarDirection);
        rightDirection.sum(calculatedFarDirection);
        return {
            center: calculatedFarDirection,
            left: leftDirection.plus(calculatedFarDirection),
            right: rightDirection.plus(calculatedFarDirection)
        };
    }
    calculateDirectionByAngle(angle) {
        return Vector2.from(Math.cos(angle), Math.sin(angle));
    }
    innerShoot({ position, target }) {
        const { center, left, right } = this.createTransformFromDirection(position, position.direction(target));
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
            position: position,
            velocity: left,
            speed: 800,
            timeToExpire: 10,
            type: ProjectileType.SHOTGUN,
            group: ProjectileGroup.PLAYER
        }));
        this.projectiles.create(new Projectile({
            radius: 16,
            damage: 2,
            position: position,
            velocity: right,
            speed: 800,
            timeToExpire: 10,
            type: ProjectileType.SHOTGUN,
            group: ProjectileGroup.PLAYER
        }));
    }
}
export { Shotgun as default };
