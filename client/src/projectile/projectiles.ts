import {Container} from "pixi.js";
import Projectile from "./projectile";

export default class Projectiles {
  private readonly MAX_PROJECTILES = 1000;
  private pool: Map<string, Projectile> = new Map();
  private readonly keys: string[];

  constructor(private readonly stage: Container) {
    this.keys = [...Array(this.MAX_PROJECTILES).keys()].map(key => String(key));
  }

  putProjectileFromRaw(key: string, rawProjectile: any) {
    const projectile = new Projectile(rawProjectile);
    this.pool.set(key, projectile);
    this.stage.addChild(projectile.polygon.graphics);
    projectile.polygon.enabled = true;
    projectile.polygon.graphics.position = rawProjectile.position;
  }

  onMessage(projectiles: any) {
    this.keys.forEach(key => {
      const rawProjectile = projectiles[key];
      const projectile = this.pool.get(key)!;
      if (!rawProjectile) {
        if (projectile) projectile.polygon.enabled = false;
        return;
      }

      if (!this.pool.has(key)) {
        this.putProjectileFromRaw(key, rawProjectile);
        return;
      }

      projectile.polygon.enabled = true;
      projectile.polygon.graphics.position = projectiles[key].position;
    });
  }

  update(deltaTime: number) {
    this.pool.forEach(projectile => {
      projectile.update(deltaTime);
    });
  }

  render() {
    this.pool.forEach(projectile => {
      projectile.render();
    });
  }
}
