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
class Ammo {
    constructor(position, weapon, quantity){
        _define_property(this, "position", void 0);
        _define_property(this, "weapon", void 0);
        _define_property(this, "quantity", void 0);
        this.position = position;
        this.weapon = weapon;
        this.quantity = quantity;
    }
}
export { Ammo as default };
