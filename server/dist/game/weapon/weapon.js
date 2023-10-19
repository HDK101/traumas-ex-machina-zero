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
import Vector2 from "../vector2.js";
class Weapon {
    canShot() {
        return this.ammo > 0 && this.currentTime <= 0;
    }
    consumeAmmo(quantity = 1) {
        this._ammo -= quantity;
        this._ammo = Math.max(this._ammo, 0);
    }
    replenishAmmo(quantity) {
        this._ammo += quantity;
        this._ammo = Math.min(this._ammo, this.maxAmmo);
    }
    shoot(shootParam) {
        if (!this.canShot()) return;
        this.innerShoot(shootParam);
        this.currentTime = this.rateInSeconds();
        this.consumeAmmo();
    }
    update(deltaTime) {
        this.currentTime -= deltaTime;
    }
    get ammo() {
        return this._ammo;
    }
    get projectiles() {
        return this._projectiles;
    }
    set projectiles(value) {
        this._projectiles = value;
    }
    constructor({ maxAmmo, onKill }){
        _define_property(this, "maxAmmo", void 0);
        _define_property(this, "position", void 0);
        _define_property(this, "target", void 0);
        _define_property(this, "onKill", void 0);
        _define_property(this, "_ammo", void 0);
        _define_property(this, "_projectiles", void 0);
        _define_property(this, "currentTime", 0.0);
        this._ammo = maxAmmo;
        this.maxAmmo = maxAmmo;
        this.onKill = onKill;
        this.position = Vector2.zero();
        this.target = Vector2.zero();
    }
}
export { Weapon as default };
