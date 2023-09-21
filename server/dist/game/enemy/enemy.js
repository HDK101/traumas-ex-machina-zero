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
    constructor({ createProjectile }){
        _define_property(this, "currentLife", 1);
        _define_property(this, "createProjectile", ()=>{});
        this.createProjectile = createProjectile;
    }
}
export { Enemy as default };
