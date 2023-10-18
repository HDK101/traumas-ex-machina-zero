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
class Ammos {
    create(ammo) {
        if (this.unusedKeys.length === 0) return;
        this.ammos.set(this.unusedKeys.shift(), ammo);
    }
    update(deltaTime) {
        const ammosObject = {};
        [
            ...this.ammos.entries()
        ].forEach(([key, ammo])=>{
            this.checkCollision(key, ammo);
            ammosObject[key] = ammo;
        });
        return ammosObject;
    }
    checkCollision(key, ammo) {
        const players = this.players.playersInRange(ammo.position, this.AMMO_RADIUS);
        if (players.length === 0) return;
        players[0].gainAmmo(ammo);
        this.ammos.delete(key);
    }
    constructor(players){
        _define_property(this, "players", void 0);
        _define_property(this, "ammos", void 0);
        _define_property(this, "unusedKeys", void 0);
        _define_property(this, "MAX_AMMOS", void 0);
        _define_property(this, "AMMO_RADIUS", void 0);
        this.players = players;
        this.MAX_AMMOS = 1000;
        this.AMMO_RADIUS = 32;
        this.ammos = new Map();
        this.unusedKeys = Array.from(Array(this.MAX_AMMOS).keys()).map((key)=>String(key));
    }
}
export { Ammos as default };
