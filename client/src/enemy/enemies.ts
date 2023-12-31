import {Container} from "pixi.js";
import Camera from "../camera/camera";
import Polygon from "../polygon";
import Enemy from "./enemy";

export default class Enemies {
  private pool: Map<string, Enemy> = new Map();
  private unusedKeys = [];

  constructor(private readonly stage: Container, private readonly camera: Camera) {}

  public onMessage(rawEnemies: any) {
    Object.keys(rawEnemies).forEach((key: string) => {
      const rawEnemy = rawEnemies[key];
      if (!this.pool.has(key)) {
        this.putEnemy(key, rawEnemy);
      }
      const enemy = this.pool.get(key)!;
      enemy.polygon.graphics.position = rawEnemy.position;
      enemy.polygon.enabled = true;

      if (rawEnemy.currentLife <= 0) {
        this.stage.removeChild(enemy.polygon.graphics);
        this.pool.delete(key);
      }
    });
  }

  private putEnemy(key: string, rawEnemy: any) {
    const polygon = new Polygon({
      points: 6,
      radius: 32,
      angleOffset: (Math.PI / 3 + Math.PI / 4) / 2,
      pointWobbleIntensity: 5,
      camera: this.camera,
      color: 0xff0000,
    });
    const enemy = new Enemy(polygon);
    this.stage.addChild(polygon.graphics);
    this.pool.set(key, enemy);
    polygon.position = rawEnemy.position;
    polygon.enabled = true;
  }

  public update(deltaTime: number) {
    this.pool.forEach(enemy => {
      enemy.update(deltaTime);
    });
  }

  public render() {
    this.pool.forEach(enemy => {
      enemy.render();
    });
  }
}
