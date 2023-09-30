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
import Midwit from "../enemy/midwit.js";
import Vector2 from "../vector2.js";
import Projectiles from "../projectile/projectiles.js";
import Players from "../player/players.js";
class Room {
    createEnemy(enemy) {
        this.enemies.set(this.currentEnemyId, enemy);
        this.currentEnemyId += 1;
    }
    formatted() {
        return {
            id: this.id,
            players: this.players.getPlayers()
        };
    }
    tick(deltaTime) {
        this.currentTime += deltaTime;
        if (this.currentTime >= 1) {
            this.currentTime = 0;
            this.createEnemy(new Midwit({
                position: Vector2.from(Math.random() * this.ROOM_MAX_WIDTH, Math.random() * this.ROOM_MAX_HEIGHT)
            }, this.createEnemyContext()));
        }
        const projectilesObject = this.projectiles.update(deltaTime);
        const enemiesObject = this.updateEnemies(deltaTime);
        this.players.update({
            projectilesObject,
            enemiesObject,
            deltaTime
        });
    }
    updateEnemies(deltaTime) {
        let enemiesObject = {};
        [
            ...this.enemies.keys()
        ].forEach((key)=>{
            const enemy = this.enemies.get(key);
            enemy.update(deltaTime);
            if (enemy.isDead) {
                this.enemies.delete(key);
                return;
            }
            enemiesObject[key] = enemy;
        });
        return enemiesObject;
    }
    getEnemies() {
        const retrievedEnemies = [];
        this.enemies.forEach((enemy)=>retrievedEnemies.push(enemy));
        return retrievedEnemies;
    }
    createEnemyContext() {
        return {
            createProjectile: (projectile)=>this.projectiles.create(projectile),
            getPlayers: ()=>this.players.getPlayers()
        };
    }
    constructor(id){
        _define_property(this, "id", void 0);
        _define_property(this, "projectiles", void 0);
        _define_property(this, "players", void 0);
        _define_property(this, "enemies", void 0);
        _define_property(this, "currentEnemyId", void 0);
        _define_property(this, "currentTime", void 0);
        _define_property(this, "ROOM_MAX_WIDTH", void 0);
        _define_property(this, "ROOM_MAX_HEIGHT", void 0);
        this.id = id;
        this.enemies = new Map();
        this.currentEnemyId = 0;
        this.currentTime = 0;
        this.ROOM_MAX_WIDTH = 2000;
        this.ROOM_MAX_HEIGHT = 2000;
        this.projectiles = new Projectiles();
        this.players = new Players(this.projectiles);
        this.projectiles.initCallbacks({
            getPlayers: ()=>this.players.getPlayers(),
            getEnemies: ()=>this.getEnemies()
        });
    }
}
export { Room as default };
