import Polygon from "../polygon";

export default class Enemy {
  constructor(public readonly polygon: Polygon) {}

  update(deltaTime: number) {
    this.polygon.update(deltaTime);
  }

  render() {
    this.polygon.render();
  }
}
