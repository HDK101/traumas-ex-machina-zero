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
export var ProjectileType;
(function(ProjectileType) {
    ProjectileType[ProjectileType["PISTOL"] = 0] = "PISTOL";
    ProjectileType[ProjectileType["SHOTGUN"] = 1] = "SHOTGUN";
    ProjectileType[ProjectileType["SMG"] = 2] = "SMG";
})(ProjectileType || (ProjectileType = {}));
export var ProjectileGroup;
(function(ProjectileGroup) {
    ProjectileGroup[ProjectileGroup["PLAYER"] = 0] = "PLAYER";
    ProjectileGroup[ProjectileGroup["ENEMY"] = 1] = "ENEMY";
})(ProjectileGroup || (ProjectileGroup = {}));
class Projectile {
    update(deltaTime) {
        this.position.sum(this.velocity.multiply(deltaTime * this.speed));
        this.timeToExpire -= deltaTime;
        return {
            queuedToDeleted: this.queuedToDeleted,
            expired: this.timeToExpire <= 0
        };
    }
    queueToDelete() {
        this.queuedToDeleted = true;
    }
    isQueuedToDelete() {
        return this.queuedToDeleted;
    }
    get squaredRadius() {
        return Math.pow(this.radius, 2);
    }
    constructor({ radius, damage, position, velocity, timeToExpire, speed, type, group }){
        _define_property(this, "radius", void 0);
        _define_property(this, "damage", void 0);
        _define_property(this, "position", void 0);
        _define_property(this, "velocity", void 0);
        _define_property(this, "speed", void 0);
        _define_property(this, "type", void 0);
        _define_property(this, "group", void 0);
        _define_property(this, "queuedToDeleted", false);
        _define_property(this, "timeToExpire", 0.0);
        this.radius = radius;
        this.damage = damage;
        this.position = position;
        this.velocity = velocity;
        this.timeToExpire = timeToExpire;
        this.type = type;
        this.group = group;
        this.speed = speed;
    }
}
export { Projectile as default };
