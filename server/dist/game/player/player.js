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
import Room from "../room/room.js";
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
        this.position.clamp(Vector2.zero(), Vector2.from(Room.MAX_WIDTH, Room.MAX_HEIGHT));
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
            deathElapsedTime: this.deathElapsedTime,
            weaponId: this.currentWeaponId,
            life: this.life,
            currentAmmo: this.selectedWeapon.ammo,
            maxAmmo: this.selectedWeapon.maxAmmo
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
    get privateKey() {
        return this._privateKey;
    }
    set privateKey(value) {
        this._privateKey = value;
    }
    changeWeapon(weaponId) {
        if (this.currentWeaponId == weaponId) return;
        this.currentWeaponId = weaponId;
        this.selectedWeapon = this.weaponAssociation[weaponId];
    }
    gainAmmo(ammo) {
        this.weapons.get(ammo.weapon).replenishAmmo(ammo.quantity);
    }
    reset() {
        this.life = 10;
        this._deathElapsedTime = 0;
        this.position = Vector2.zero();
    }
    formattedGameEnd() {
        return {
            privateKey: this.privateKey,
            enemiesKilled: this.enemiesKilled,
            score: this.score
        };
    }
    constructor({ id, position }){
        _define_property(this, "id", void 0);
        _define_property(this, "position", void 0);
        _define_property(this, "velocity", void 0);
        _define_property(this, "life", 100);
        _define_property(this, "shooting", false);
        _define_property(this, "target", void 0);
        _define_property(this, "_projectiles", void 0);
        _define_property(this, "_privateKey", void 0);
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
        _define_property(this, "enemiesKilled", 0);
        _define_property(this, "score", 0);
        const onKill = ()=>{
            this.score += 50;
            this.enemiesKilled += 1;
        };
        this.id = id;
        this.position = position;
        this.velocity = Vector2.zero();
        this.pistol = new Pistol({
            maxAmmo: 50,
            onKill
        });
        this.smg = new SMG({
            maxAmmo: 200,
            onKill
        });
        this.shotgun = new Shotgun({
            maxAmmo: 50,
            onKill
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
