import Camera from '../camera/camera';
import Polygon from '../polygon';
import Vector2 from '../vector2';

interface ProjectileConstructor {
  type: number;
  radius: number;
  position: Vector2;
  camera: Camera;
}

export default class Projectile {
  type: number;
  radius: number;
  position: Vector2;
  polygon: Polygon;
  camera: Camera;

  constructor({
    type,
    radius,
    position,
    camera,
  }: ProjectileConstructor) {
    this.type = type;
    this.radius = radius;
    this.position = position;
    this.camera = camera;
    
    this.polygon = new Polygon({
      radius,
      points: 5,
      pointWobbleIntensity: 1,
      camera: this.camera,
      color: 0xffffff,
    });
  }

  update(deltaTime: number) {
    this.polygon.update(deltaTime);
  }

  render() {
    this.polygon.render();
  }
}
