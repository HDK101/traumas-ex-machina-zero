export interface RawVector2 {
  x: number;
  y: number;
}

export default class Vector2 {
  constructor(public x: number, public y: number) {}

  static from(x: number, y: number) {
    return new Vector2(x, y);
  }

  static fromRaw({ x, y }: RawVector2) {
    return Vector2.from(x, y);
  }

  static zero() {
    return new Vector2(0, 0);
  }

  clamp(min: Vector2, max: Vector2) {
    this.x = this.x <= min.x ? min.x : this.x;
    this.x = this.x >= max.x ? max.x : this.x;

    this.y = this.y <= min.y ? min.y : this.y;
    this.y = this.y >= max.y ? max.y : this.y;
  }

  sum(vector: Vector2) {
    this.x += vector.x;
    this.y += vector.y;
  }

  plus(vector: Vector2) {
    return Vector2.from(this.x + vector.x, this.y + vector.y);
  }

  distance(to: Vector2) {
    const deltaX = Math.pow(to.x - this.x, 2);
    const deltaY = Math.pow(to.y - this.y, 2);
    return Math.sqrt(deltaX + deltaY);
  }
 
  direction(to: Vector2) {
    const calculatedDistance = this.distance(to);
    const rawDirection = Vector2.from(to.x - this.x, to.y - this.y);

    const normalizedDirection = rawDirection.divide(calculatedDistance);

    return normalizedDirection;
  }

  squareDistance(to: Vector2) {
    const deltaX = Math.pow(to.x - this.x, 2);
    const deltaY = Math.pow(to.y - this.y, 2);
    return deltaX + deltaY;
  }

  multiply(value: number) {
    return new Vector2(this.x * value, this.y * value);
  }

  divide(value: number) {
    return new Vector2(this.x / value, this.y / value);
  }

  clone() {
    return Vector2.from(this.x, this.y);
  }

  lerp(target: Vector2, weight = 0.0) {
    return Vector2.from(
      this.x + (target.x - this.x) * weight,
      this.y + (target.y - this.y) * weight
    );
  }
}

