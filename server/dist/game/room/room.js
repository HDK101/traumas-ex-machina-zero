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
import Enemies from "../enemy/enemies.js";
class Room {
    formatted() {
        return {
            id: this.id,
            players: this.players.all
        };
    }
    tick(deltaTime) {
        this.currentTime += deltaTime;
        if (this.currentTime >= 1) {
            this.currentTime = 0;
            this.enemies.create(new Midwit({
                position: Vector2.from(Math.random() * this.ROOM_MAX_WIDTH, Math.random() * this.ROOM_MAX_HEIGHT)
            }, this.enemies.createEnemyContext()));
        }
        const projectilesObject = this.projectiles.update(deltaTime);
        const enemiesObject = this.enemies.update(deltaTime);
        this.players.update({
            projectilesObject,
            enemiesObject,
            deltaTime
        });
    }
    constructor(id){
        _define_property(this, "id", void 0);
        _define_property(this, "projectiles", void 0);
        _define_property(this, "players", void 0);
        _define_property(this, "enemies", void 0);
        _define_property(this, "currentTime", void 0);
        _define_property(this, "ROOM_MAX_WIDTH", void 0);
        _define_property(this, "ROOM_MAX_HEIGHT", void 0);
        this.id = id;
        this.currentTime = 0;
        this.ROOM_MAX_WIDTH = 2000;
        this.ROOM_MAX_HEIGHT = 2000;
        this.projectiles = new Projectiles();
        this.players = new Players(this.projectiles);
        this.enemies = new Enemies(this.players, this.projectiles);
        this.projectiles.initCallbacks({
            getPlayers: ()=>this.players.all,
            getEnemies: ()=>this.enemies.all
        });
    }
}
export { Room as default };
