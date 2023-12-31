import Ammo from "../ammo/ammo";
import Ammos from "../ammo/ammos";
import Players from "../player/players";
import Projectile from "../projectile/projectile";
import Projectiles from "../projectile/projectiles";
import Enemy from "./enemy";

export interface EnemiesObject {
  [key: string]: Enemy;
}

export default class Enemies {
  private pool: Map<string, Enemy> = new Map();
  private currentEnemyId = 0;
  private unusedKeys: string[] = [];

  constructor(private readonly players: Players, private readonly projectiles: Projectiles, private readonly ammos: Ammos) {}

  public create(enemy: Enemy) {
    if (this.unusedKeys.length > 0) {
      this.pool.set(this.unusedKeys.shift()!, enemy);
      return;
    }

    this.pool.set(String(this.currentEnemyId), enemy);
    this.currentEnemyId += 1;
  }

  public update(deltaTime: number) {
    let enemiesObject: EnemiesObject = {};

    const enemyEntries = [...this.pool.entries()];

    enemyEntries
        .forEach(([key, enemy])=> {
          enemiesObject[key] = enemy;
        });

    enemyEntries
        .filter(([, enemy]) => enemy.isDead)
        .forEach(([key, enemy]) => {
          this.unusedKeys.push(key);
          this.pool.delete(key);
        });
    
    enemyEntries
        .filter(([, enemy]) => !enemy.isDead)
        .forEach(([key, enemy])=> {
          enemy.update(deltaTime);
        });

    return enemiesObject;
  }

  public get all(): Enemy[] {
    return [...this.pool.values()];
  }

  public get allAlive(): Enemy[] {
    return [...this.pool.values()].filter(enemy => !enemy.isDead);
  }

  public createEnemyContext() {
    return {
      createProjectile: (projectile: Projectile) => this.projectiles.create(projectile),
      getPlayers: () => this.players.all,
      createAmmo: (ammo: Ammo) => this.ammos.create(ammo),
    };
  }
}
