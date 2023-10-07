import Camera from "../camera/camera";
import Polygon from "../polygon";
import Vector2, {RawVector2} from "../vector2";

export default class Ammo {
  public readonly polygon: Polygon;
  public position: RawVector2 = { x: 0, y: 0 };

  constructor(private readonly camera: Camera) {
    this.polygon = new Polygon({
      radius: 16,
      points: 5,
      pointWobbleIntensity: 1,
      camera,
    });
  }

  update(deltaTime: number) {
    this.polygon.update(deltaTime);
    this.polygon.position = Vector2.from(this.position.x, this.position.y);
  }

  render() {
    this.polygon.render();
  }
}
