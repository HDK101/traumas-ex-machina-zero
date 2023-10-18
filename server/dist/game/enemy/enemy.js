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
import Ammo from "../ammo/ammo.js";
class Enemy {
    update(delta) {
        this.move(delta);
        this.innerUpdate(delta);
    }
    get isDead() {
        return this.currentLife <= 0;
    }
    damage(value) {
        this.currentLife -= value;
        if (this.currentLife <= 0) {
            this.onDeath();
        }
    }
    onDeath() {
        this.context.createAmmo(new Ammo(this.position.clone(), Math.floor(Math.random() * 3), Math.round(Math.random() * 10) * 5));
    }
    set life(value) {
        this.currentLife = value;
    }
    move(delta) {
        this.position.sum(this.velocity.multiply(delta));
    }
    constructor({ position }, context){
        _define_property(this, "context", void 0);
        _define_property(this, "position", void 0);
        _define_property(this, "velocity", void 0);
        _define_property(this, "radius", void 0);
        _define_property(this, "currentLife", void 0);
        this.context = context;
        this.velocity = Vector2.from(0, 0);
        this.radius = 16;
        this.currentLife = 100;
        this.position = position;
        this.start();
    }
}
export { Enemy as default };
