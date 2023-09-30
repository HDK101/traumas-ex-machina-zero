import Polygon from '../polygon';
import Vector2 from '../vector2';

interface ProjectileConstructor {
  type: number;
  radius: number;
  position: Vector2;
}

export default class Projectile {
  type: number;
  radius: number;
  position: Vector2;
  polygon: Polygon;

  constructor({
    type,
    radius,
    position,
  }: ProjectileConstructor) {
    this.type = type;
    this.radius = radius;
    this.position = position;
    
    this.polygon = new Polygon({
      radius,
      points: 5,
      pointWobbleIntensity: 1,
    });
  }

  update(deltaTime: number) {
    this.polygon.update(deltaTime);
  }

  render() {
    this.polygon.render();
  }
}
