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
import Enemy from "./enemy.js";
class Midwit extends Enemy {
    start() {
        this.life = 10;
    }
    update(delta) {
        this.currentTime += delta;
        if (this.currentTime >= 0.5) {
            this.context.createProjectile({
                radius: 2,
                damage: 2,
                position: Vector2.from(0, 0),
                velocity: Vector2.from(100, 50)
            });
            this.currentTime = 0;
        }
        console.log(this.context.getPlayers());
        console.log("midwit update", delta);
    }
    constructor(...args){
        super(...args);
        _define_property(this, "currentTime", 0);
    }
}
export { Midwit as default };