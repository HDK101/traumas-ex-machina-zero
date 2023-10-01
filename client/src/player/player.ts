import Camera from "../camera/camera";
import Polygon from "../polygon";
import Vector2 from "../vector2";

export default class Player {
  life: number;
  position: Vector2
  polygon: Polygon;

  constructor(camera: Camera) {
    this.life = 100;
    this.position = Vector2.zero();
    this.polygon = new Polygon({
      points: 6,
      radius: 32,
      angleOffset: (Math.PI / 3 + Math.PI / 4) / 2,
      pointWobbleIntensity: 5,
      camera,
    });
  }
}
