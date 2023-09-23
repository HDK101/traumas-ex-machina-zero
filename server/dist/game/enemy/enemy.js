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
class Enemy {
    get isDead() {
        return this.currentLife <= 0;
    }
    set life(value) {
        this.currentLife = value;
    }
    constructor(context){
        _define_property(this, "context", void 0);
        _define_property(this, "currentLife", void 0);
        this.context = context;
        this.currentLife = 1;
    }
}
export { Enemy as default };
