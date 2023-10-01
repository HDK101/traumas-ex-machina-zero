import {Container} from "pixi.js";
import Polygon from "../polygon";
import Enemy from "./enemy";

export default class Enemies {
  private pool: Map<string, Enemy> = new Map();
  private unusedKeys = [];

  constructor(private readonly stage: Container) {}

  public onMessage(rawEnemies: any) {
    Object.keys(rawEnemies).forEach((key: string) => {
      const rawEnemy = rawEnemies[key];
      if (!this.pool.has(key)) {
        this.putEnemy(key, rawEnemy);
      }
      const enemy = this.pool.get(key)!;
      enemy.polygon.graphics.position = rawEnemy.position;

      if (rawEnemy.currentLife <= 0) {
        enemy.polygon.enabled = false;
      }
    });
  }

  private putEnemy(key: string, rawEnemy: any) {
    const polygon = new Polygon({
      points: 6,
      radius: 32,
      angleOffset: (Math.PI / 3 + Math.PI / 4) / 2,
      pointWobbleIntensity: 5,
    });
    const enemy = new Enemy(polygon);
    this.stage.addChild(polygon.graphics);
    this.pool.set(key, enemy);
    polygon.graphics.position = rawEnemy.position;
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
