function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
import Projectile, { ProjectileGroup, ProjectileType } from "../projectile.js";
import Enemy from "./enemy.js";
class Midwit extends Enemy {
    start() {
        this.life = 10;
    }
    innerUpdate(delta) {
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
                    position: Object.create(this.position),
                    velocity: this.position.direction(firstPlayer.position),
                    timeToExpire: 10,
                    speed: 300
                }));
                this.currentTime = 0;
            }
        }
    }
    constructor(...args){
        super(...args);
        _define_property(this, "currentTime", 0);
    }
}
export { Midwit as default };
