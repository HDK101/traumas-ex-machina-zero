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
import Projectiles from "../projectile/projectiles.js";
import Players from "../player/players.js";
import Enemies from "../enemy/enemies.js";
import Waves from "../wave/waves.js";
import Ammos from "../ammo/ammos.js";
class Room {
    formatted() {
        return {
            id: this.id,
            players: this.players.all,
            wave: this.waves.wave
        };
    }
    tick(deltaTime) {
        this.timeElapsed += deltaTime;
        const projectilesObject = this.projectiles.update(deltaTime);
        const enemiesObject = this.enemies.update(deltaTime);
        const ammosObject = this.ammos.update(deltaTime);
        this.waves.update(deltaTime);
        this.players.update({
            ammosObject,
            projectilesObject,
            enemiesObject,
            deltaTime,
            waveInfo: {
                currentTime: this.waves.waveTime,
                wave: this.waves.wave,
                finished: this.waves.noMoreWave
            }
        });
        return this.waves.noMoreWave || this.players.all.length === 0 && this.timeElapsed > 5;
    }
    constructor(id){
        _define_property(this, "id", void 0);
        _define_property(this, "timeElapsed", void 0);
        _define_property(this, "projectiles", void 0);
        _define_property(this, "players", void 0);
        _define_property(this, "enemies", void 0);
        _define_property(this, "ammos", void 0);
        _define_property(this, "waves", void 0);
        this.id = id;
        this.timeElapsed = 0.0;
        this.projectiles = new Projectiles();
        this.players = new Players(this.projectiles);
        this.ammos = new Ammos(this.players);
        this.enemies = new Enemies(this.players, this.projectiles, this.ammos);
        this.projectiles.initCallbacks({
            getPlayers: ()=>this.players.all,
            getEnemies: ()=>this.enemies.all
        });
        this.waves = new Waves(this.enemies);
    }
}
_define_property(Room, "MAX_WIDTH", 2000);
_define_property(Room, "MAX_HEIGHT", 2000);
export { Room as default };
