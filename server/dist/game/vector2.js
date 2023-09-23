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
export function sumVectors(vec1, vec2) {
    vec1.x += vec2.x;
    vec1.y += vec2.y;
}
export function multiplyVectorByValue(vec, value) {
    return {
        x: vec.x * value,
        y: vec.y * value
    };
}
class Vector2 {
    static from(x, y) {
        return new Vector2(x, y);
    }
    static zero() {
        return new Vector2(0, 0);
    }
    sum(vector) {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }
    multiply(value) {
        this.x *= value;
        this.y *= value;
        return this;
    }
    sumObject(vector) {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }
    constructor(x, y){
        _define_property(this, "x", void 0);
        _define_property(this, "y", void 0);
        this.x = x;
        this.y = y;
    }
}
export { Vector2 as default };
