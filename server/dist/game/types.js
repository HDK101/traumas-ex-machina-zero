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
import Vector2 from "./vector2.js";
export class Player {
    move(delta) {
        console.log(this.velocity.multiply(delta));
        this.position.sum(this.velocity.multiply(delta));
    }
    constructor({ id, position }){
        _define_property(this, "id", void 0);
        _define_property(this, "position", void 0);
        _define_property(this, "velocity", void 0);
        this.id = id;
        this.position = position;
        this.velocity = Vector2.zero();
    }
}
