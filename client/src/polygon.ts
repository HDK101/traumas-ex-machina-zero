import * as PIXI from 'pixi.js';

interface PolygonConstructor {
  radius: number;
  points: number;
  angleOffset: number;
  pointWobbleIntensity: number;
}

export default class Polygon {
  enabled: boolean = true;
  elapsedTime: number = 0;

  radius: number;
  points: number;
  angleOffset: number;
  pointWobbleIntensity: number;

  public readonly graphics: PIXI.Graphics;

  constructor({
    radius,
    points,
    angleOffset,
    pointWobbleIntensity,
  }: PolygonConstructor) {
    this.radius = radius;
    this.points = points;
    this.angleOffset = angleOffset;
    this.pointWobbleIntensity = pointWobbleIntensity;
    this.graphics = new PIXI.Graphics();
  }

  update(deltaTime: number) {
    this.elapsedTime += deltaTime;
    this.graphics.clear();
    if (!this.enabled) return;
    this.graphics.lineStyle(5, 0xff0000);
    const calculatedPoints: PIXI.IPointData[] = [];
    for (let i = 0; i < this.points; i++) {
      const rads = 2 * Math.PI * (i / this.points) + this.angleOffset;
      const offset = i / 2 * Math.PI;
      const calculatedOffsetX = Math.sin(this.elapsedTime * 0.1 + offset) * this.pointWobbleIntensity;
      const calculatedOffsetY = Math.cos(this.elapsedTime * 0.1 + offset) * this.pointWobbleIntensity;
      calculatedPoints.push({
        x: Math.cos(rads) * this.radius + calculatedOffsetX,
        y: Math.sin(rads) * this.radius + calculatedOffsetY,
      });
    }
    this.graphics.drawPolygon(calculatedPoints);
  }
}
