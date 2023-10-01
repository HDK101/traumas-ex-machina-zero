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
import Pistol from "../weapon/pistol.js";
import { WeaponList } from "../weapon/weaponList.js";
class Player {
    update(deltaTime) {
        if (this.shooting) {
            this.pistol.shoot({
                position: this.position.clone(),
                target: this.target.clone()
            });
        }
        this.move(deltaTime);
        this.pistol.update(deltaTime);
    }
    move(deltaTime) {
        this.position.sum(this.velocity.multiply(deltaTime));
    }
    damage(value) {
        this.life -= value;
    }
    formatted() {
        return {
            id: this.id,
            position: this.position,
            velocity: this.velocity,
            radius: this.radius
        };
    }
    get squaredRadius() {
        return Math.pow(this.radius, 2);
    }
    set projectiles(value) {
        this._projectiles = value;
        this.pistol.projectiles = value;
    }
    get projectiles() {
        return this._projectiles;
    }
    constructor({ id, position }){
        _define_property(this, "id", void 0);
        _define_property(this, "position", void 0);
        _define_property(this, "velocity", void 0);
        _define_property(this, "life", 100);
        _define_property(this, "shooting", false);
        _define_property(this, "target", void 0);
        _define_property(this, "_projectiles", void 0);
        _define_property(this, "speed", 300);
        _define_property(this, "radius", 32);
        _define_property(this, "weapon", void 0);
        _define_property(this, "selectedWeapon", void 0);
        _define_property(this, "pistol", void 0);
        this.id = id;
        this.position = position;
        this.velocity = Vector2.zero();
        this.weapon = WeaponList.PISTOL;
        this.pistol = new Pistol({
            maxAmmo: 50
        });
        this.selectedWeapon = this.pistol;
    }
}
export { Player as default };
