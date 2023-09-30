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
        this.pool.set(this.currentEnemyId, enemy);
        this.currentEnemyId += 1;
    }
    update(deltaTime) {
        let enemiesObject = {};
        [
            ...this.pool.entries()
        ].forEach(([key, enemy])=>{
            enemy.update(deltaTime);
            if (enemy.isDead) {
                this.pool.delete(key);
                return;
            }
            enemiesObject[key] = enemy;
        });
        return enemiesObject;
    }
    get all() {
        return [
            ...this.pool.values()
        ];
    }
    createEnemyContext() {
        return {
            createProjectile: (projectile)=>this.projectiles.create(projectile),
            getPlayers: ()=>this.players.all
        };
    }
    constructor(players, projectiles){
        _define_property(this, "players", void 0);
        _define_property(this, "projectiles", void 0);
        _define_property(this, "pool", void 0);
        _define_property(this, "currentEnemyId", void 0);
        this.players = players;
        this.projectiles = projectiles;
        this.pool = new Map();
        this.currentEnemyId = 0;
    }
}
export { Enemies as default };
