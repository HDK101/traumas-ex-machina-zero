export default class Vector2 {
  constructor(public x: number, public y: number) {}

  static from(x: number, y: number) {
    return new Vector2(x, y);
  }

  static zero() {
    return new Vector2(0, 0);
  }

  sum(vector: Vector2) {
    this.x += vector.x;
    this.y += vector.y;
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
}

