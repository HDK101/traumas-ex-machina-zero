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
class Enemies {
    create(enemy) {
        if (this.unusedKeys.length > 0) {
            console.log(this.unusedKeys);
            this.pool.set(this.unusedKeys.shift(), enemy);
            return;
        }
        this.pool.set(String(this.currentEnemyId), enemy);
        this.currentEnemyId += 1;
    }
    update(deltaTime) {
        let enemiesObject = {};
        const enemyEntries = [
            ...this.pool.entries()
        ];
        enemyEntries.forEach(([key, enemy])=>{
            enemiesObject[key] = enemy;
        });
        enemyEntries.filter(([, enemy])=>enemy.isDead).forEach(([key, enemy])=>{
            this.unusedKeys.push(key);
            this.pool.delete(key);
        });
        enemyEntries.filter(([, enemy])=>!enemy.isDead).forEach(([key, enemy])=>{
            enemy.update(deltaTime);
        });
        return enemiesObject;
    }
    get all() {
        return [
            ...this.pool.values()
        ];
    }
    get allAlive() {
        return [
            ...this.pool.values()
        ].filter((enemy)=>!enemy.isDead);
    }
    createEnemyContext() {
        return {
            createProjectile: (projectile)=>this.projectiles.create(projectile),
            getPlayers: ()=>this.players.all,
            createAmmo: (ammo)=>this.ammos.create(ammo)
        };
    }
    constructor(players, projectiles, ammos){
        _define_property(this, "players", void 0);
        _define_property(this, "projectiles", void 0);
        _define_property(this, "ammos", void 0);
        _define_property(this, "pool", void 0);
        _define_property(this, "currentEnemyId", void 0);
        _define_property(this, "unusedKeys", void 0);
        this.players = players;
        this.projectiles = projectiles;
        this.ammos = ammos;
        this.pool = new Map();
        this.currentEnemyId = 0;
        this.unusedKeys = [];
    }
}
export { Enemies as default };
