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
class Projectile {
    update(deltaTime) {
        this.position.sum(this.velocity.multiply(deltaTime));
        this.timeToExpire -= deltaTime;
        return {
            expired: this.timeToExpire <= 0
        };
    }
    constructor({ radius, damage, position, velocity, timeToExpire }){
        _define_property(this, "radius", void 0);
        _define_property(this, "damage", void 0);
        _define_property(this, "position", void 0);
        _define_property(this, "velocity", void 0);
        _define_property(this, "timeToExpire", 0.0);
        this.radius = radius;
        this.damage = damage;
        this.position = position;
        this.velocity = velocity;
        this.timeToExpire = timeToExpire;
    }
}
export { Projectile as default };
