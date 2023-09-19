import * as PIXI from 'pixi.js';

export default class Polygon {
  elapsedTime: number = 0;

  public readonly graphics: PIXI.Graphics;

  constructor(public readonly points: number) {
    this.graphics = new PIXI.Graphics();
  }

  update(deltaTime: number) {
    this.elapsedTime += deltaTime;
    this.graphics.clear();
    this.graphics.lineStyle(5, 0xff0000);
    const calculatedPoints: PIXI.IPointData[] = [];
    for (let i = 0; i < this.points; i++) {
      const rads = 2 * Math.PI * (i / this.points) + Math.PI / 4;
      const offset = i / 2 * Math.PI;
      const offsetRadius = 5;
      const calculatedOffsetX = Math.sin(this.elapsedTime * 0.1 + offset) * offsetRadius;
      const calculatedOffsetY = Math.cos(this.elapsedTime * 0.1 + offset) * offsetRadius;
      calculatedPoints.push({
        x: Math.cos(rads) * 100 + calculatedOffsetX,
        y: Math.sin(rads) * 100 + calculatedOffsetY,
      });
    }
    this.graphics.drawPolygon(calculatedPoints);
  }
}
