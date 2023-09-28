import * as PIXI from 'pixi.js';

interface PolygonConstructor {
  radius: number;
  points: number; angleOffset: number;
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

  private calculatedPoints: PIXI.IPointData[] = [];

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
    this.calculatedPoints = [];
    this.elapsedTime += deltaTime;
    if (!this.enabled) return;
    for (let i = 0; i < this.points; i++) {
      const rads = 2 * Math.PI * (i / this.points) + this.angleOffset;
      const offset = i / 2 * Math.PI;
      const calculatedOffsetX = Math.sin(this.elapsedTime * 0.1 + offset) * this.pointWobbleIntensity;
      const calculatedOffsetY = Math.cos(this.elapsedTime * 0.1 + offset) * this.pointWobbleIntensity;
      this.calculatedPoints.push({
        x: Math.cos(rads) * this.radius + calculatedOffsetX,
        y: Math.sin(rads) * this.radius + calculatedOffsetY,
      });
    }
  }

  render() {
    this.graphics.clear();
    this.graphics.lineStyle(5, 0xff0000);
    this.graphics.drawPolygon(this.calculatedPoints);
  }
}
