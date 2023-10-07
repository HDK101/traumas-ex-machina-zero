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
import Shotgun from "../weapon/shotgun.js";
import SMG from "../weapon/smg.js";
import { WeaponList } from "../weapon/weaponList.js";
class Player {
    update(deltaTime) {
        if (this.life <= 0) {
            this._deathElapsedTime += deltaTime;
            return;
        }
        if (this.shooting) {
            this.selectedWeapon.shoot({
                position: this.position.clone(),
                target: this.target.clone()
            });
        }
        this.move(deltaTime);
        this.selectedWeapon.update(deltaTime);
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
            radius: this.radius,
            deathElapsedTime: this.deathElapsedTime
        };
    }
    get squaredRadius() {
        return Math.pow(this.radius, 2);
    }
    set projectiles(value) {
        this._projectiles = value;
        this.pistol.projectiles = value;
        this.smg.projectiles = value;
        this.shotgun.projectiles = value;
    }
    get projectiles() {
        return this._projectiles;
    }
    get deathElapsedTime() {
        return this._deathElapsedTime;
    }
    changeWeapon(weaponId) {
        if (this.currentWeaponId == weaponId) return;
        this.currentWeaponId = weaponId;
        this.selectedWeapon = this.weaponAssociation[weaponId];
    }
    gainAmmo(ammo) {
        this.weapons.get(ammo.weapon).replenishAmmo(ammo.quantity);
    }
    constructor({ id, position }){
        _define_property(this, "id", void 0);
        _define_property(this, "position", void 0);
        _define_property(this, "velocity", void 0);
        _define_property(this, "life", 10);
        _define_property(this, "shooting", false);
        _define_property(this, "target", void 0);
        _define_property(this, "_projectiles", void 0);
        _define_property(this, "speed", 300);
        _define_property(this, "radius", 32);
        _define_property(this, "currentWeaponId", 1);
        _define_property(this, "selectedWeapon", void 0);
        _define_property(this, "pistol", void 0);
        _define_property(this, "shotgun", void 0);
        _define_property(this, "smg", void 0);
        _define_property(this, "_deathElapsedTime", 0);
        _define_property(this, "weapons", new Map());
        _define_property(this, "weaponAssociation", void 0);
        this.id = id;
        this.position = position;
        this.velocity = Vector2.zero();
        this.pistol = new Pistol({
            maxAmmo: 50
        });
        this.smg = new SMG({
            maxAmmo: 200
        });
        this.shotgun = new Shotgun({
            maxAmmo: 50
        });
        this.selectedWeapon = this.pistol;
        this.weapons.set(WeaponList.PISTOL, this.pistol);
        this.weapons.set(WeaponList.SHOTGUN, this.shotgun);
        this.weapons.set(WeaponList.SMG, this.smg);
        this.weaponAssociation = {
            1: this.pistol,
            2: this.smg,
            3: this.shotgun
        };
    }
}
export { Player as default };
