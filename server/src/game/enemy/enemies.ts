import Players from "../player/players";
import Projectile from "../projectile/projectile";
import Projectiles from "../projectile/projectiles";
import Enemy from "./enemy";

export interface EnemiesObject {
  [key: string]: Enemy;
}

export default class Enemies {
  private pool: Map<number, Enemy> = new Map();
  private currentEnemyId = 0;

  constructor(private readonly players: Players, private readonly projectiles: Projectiles) {}

  public create(enemy: Enemy) {
    this.pool.set(this.currentEnemyId, enemy);
    this.currentEnemyId += 1;
  }

  public update(deltaTime: number) {
    let enemiesObject: EnemiesObject = {};

    [...this.pool.entries()].forEach(([key, enemy])=> {
      enemy.update(deltaTime);

      if (enemy.isDead) {
        this.pool.delete(key);
        return;
      }

      enemiesObject[key] = enemy;
    });

    return enemiesObject;
  }

  public get all(): Enemy[] {
    return [...this.pool.values()];
  }

  public createEnemyContext() {
    return {
      createProjectile: (projectile: Projectile) => this.projectiles.create(projectile),
      getPlayers: () => this.players.all,
    };
  }
}
