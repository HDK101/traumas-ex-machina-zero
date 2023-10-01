import Vector2 from "../vector2";

export default class Camera {
  position: Vector2;

  constructor() {
    this.position = Vector2.from(0, 0);
  }
}
