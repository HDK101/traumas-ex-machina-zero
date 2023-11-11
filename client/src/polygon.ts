import * as PIXI from 'pixi.js';
import Camera from './camera/camera';
import Vector2 from './vector2';

interface PolygonConstructor {
  radius: number;
  points: number; 
  angleOffset?: number;
  pointWobbleIntensity: number;
  camera: Camera;
  color: number;
}

export default class Polygon {
  enabled: boolean = true;
  elapsedTime: number = 0;
  color: number;

  radius: number;
  points: number;
  angleOffset: number;
  pointWobbleIntensity: number;
  camera: Camera;
  position: Vector2;

  public readonly graphics: PIXI.Graphics;

  private calculatedPoints: PIXI.IPointData[] = [];

  constructor({
    radius,
    points,
    pointWobbleIntensity,
    camera,
    color,
    angleOffset = 0,
  }: PolygonConstructor) {
    this.position = Vector2.zero();
    this.radius = radius;
    this.points = points;
    this.color = color;
    this.angleOffset = (Math.PI / 3 + Math.PI / 4) / 2 + angleOffset;
    this.pointWobbleIntensity = pointWobbleIntensity;
    this.graphics = new PIXI.Graphics();
    this.camera = camera;
  }

  update(deltaTime: number) {
    this.calculatedPoints = [];
    this.elapsedTime += deltaTime;
    this.graphics.position.x = -(this.camera.position.x - this.position.x);
    this.graphics.position.y = -(this.camera.position.y - this.position.y);
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
    if (!this.enabled) return;
    this.graphics.lineStyle(5, this.color);
    this.graphics.drawPolygon(this.calculatedPoints);
  }
}
