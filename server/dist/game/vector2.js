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
class Vector2 {
    static from(x, y) {
        return new Vector2(x, y);
    }
    static fromRaw({ x, y }) {
        return Vector2.from(x, y);
    }
    static zero() {
        return new Vector2(0, 0);
    }
    clamp(min, max) {
        this.x = this.x <= min.x ? min.x : this.x;
        this.x = this.x >= max.x ? max.x : this.x;
        this.y = this.y <= min.y ? min.y : this.y;
        this.y = this.y >= max.y ? max.y : this.y;
    }
    sum(vector) {
        this.x += vector.x;
        this.y += vector.y;
    }
    plus(vector) {
        return Vector2.from(this.x + vector.x, this.y + vector.y);
    }
    distance(to) {
        const deltaX = Math.pow(to.x - this.x, 2);
        const deltaY = Math.pow(to.y - this.y, 2);
        return Math.sqrt(deltaX + deltaY);
    }
    direction(to) {
        const calculatedDistance = this.distance(to);
        const rawDirection = Vector2.from(to.x - this.x, to.y - this.y);
        const normalizedDirection = rawDirection.divide(calculatedDistance);
        return normalizedDirection;
    }
    squareDistance(to) {
        const deltaX = Math.pow(to.x - this.x, 2);
        const deltaY = Math.pow(to.y - this.y, 2);
        return deltaX + deltaY;
    }
    multiply(value) {
        return new Vector2(this.x * value, this.y * value);
    }
    divide(value) {
        return new Vector2(this.x / value, this.y / value);
    }
    clone() {
        return Vector2.from(this.x, this.y);
    }
    lerp(target, weight = 0.0) {
        return Vector2.from(this.x + (target.x - this.x) * weight, this.y + (target.y - this.y) * weight);
    }
    constructor(x, y){
        _define_property(this, "x", void 0);
        _define_property(this, "y", void 0);
        this.x = x;
        this.y = y;
    }
}
export { Vector2 as default };
