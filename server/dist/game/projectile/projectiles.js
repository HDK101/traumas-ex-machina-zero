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
import { ProjectileGroup } from "./projectile.js";
class Projectiles {
    initCallbacks({ getPlayers, getEnemies }) {
        this.getPlayers = getPlayers;
        this.getEnemies = getEnemies;
    }
    create(projectile) {
        if (this.unusedProjectileIds.length === 0) return;
        this.pool.set(this.unusedProjectileIds.shift(), projectile);
    }
    update(deltaTime) {
        const projectilesObject = Object.fromEntries(this.pool);
        const playersProjectiles = Object.values(projectilesObject).filter((projectile)=>projectile.group === ProjectileGroup.PLAYER);
        const enemyProjectiles = Object.values(projectilesObject).filter((projectile)=>projectile.group === ProjectileGroup.ENEMY);
        playersProjectiles.forEach((projectile)=>{
            this.checkCollisionEnemies(projectile);
        });
        enemyProjectiles.forEach((projectile)=>{
            this.checkCollisionPlayers(projectile);
        });
        Object.entries(projectilesObject).forEach(([key, projectile])=>{
            const { queuedToDeleted, expired } = projectile.update(deltaTime);
            if (expired || queuedToDeleted) {
                this.pool.delete(key);
                this.unusedProjectileIds.push(key);
                delete projectilesObject[key];
            }
        });
        return projectilesObject;
    }
    checkCollisionPlayers(projectile) {
        const playersInRange = this.getPlayers().filter((player)=>player.position.squareDistance(projectile.position) <= Math.pow(projectile.radius + player.radius, 2));
        playersInRange.forEach((player)=>player.damage(projectile.damage));
        if (playersInRange.length > 0) projectile.queueToDelete();
    }
    checkCollisionEnemies(projectile) {
        const enemiesInRange = this.getEnemies().filter((enemy)=>enemy.position.squareDistance(projectile.position) <= Math.pow(projectile.radius + enemy.radius, 2)).filter((enemy)=>!enemy.isDead);
        enemiesInRange.forEach((enemy)=>enemy.damage(projectile.damage));
        if (enemiesInRange.length > 0) projectile.queueToDelete();
    }
    constructor(){
        _define_property(this, "pool", new Map());
        _define_property(this, "unusedProjectileIds", []);
        _define_property(this, "getPlayers", void 0);
        _define_property(this, "getEnemies", void 0);
        _define_property(this, "MAX_PROJECTILES", 1000);
        this.unusedProjectileIds = Array.from(Array(this.MAX_PROJECTILES).keys()).map((key)=>String(key));
    }
}
export { Projectiles as default };
