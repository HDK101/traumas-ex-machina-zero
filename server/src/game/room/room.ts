import Player from "../player/player.js";
import { PlayerConnection } from "../player/playerConnection.js";
import Projectile from "../projectile/projectile.js";
import Enemy from "../enemy/enemy.js";
import Midwit from "../enemy/midwit.js";
import Vector2 from "../vector2.js";
import Projectiles, {ProjectilesObject} from "../projectile/projectiles.js";
import Players from "../player/players.js";

export interface EnemiesObject { [key: number]: Enemy }

export default class Room {
  public projectiles: Projectiles;
  public players: Players;

  private enemies: Map<number, Enemy> = new Map();

  private currentEnemyId = 0;
  private currentTime = 0;

  private readonly ROOM_MAX_WIDTH = 2000;
  private readonly ROOM_MAX_HEIGHT = 2000;

  constructor(public readonly id: number) {
    this.projectiles = new Projectiles();
    this.players = new Players(this.projectiles);
    this.projectiles.initCallbacks({
      getPlayers: () => this.players.getPlayers(),
      getEnemies: () => this.getEnemies(),
    });
  }

  public createEnemy(enemy: Enemy) {
    this.enemies.set(this.currentEnemyId, enemy);
    this.currentEnemyId += 1;
  }


  public formatted() {
    return {
      id: this.id,
      players: this.players.getPlayers(),
    };
  }

  public tick(deltaTime: number) {
    this.currentTime += deltaTime;

    if (this.currentTime >= 1) {
      this.currentTime = 0;

      this.createEnemy(new Midwit({
        position: Vector2.from(Math.random() * this.ROOM_MAX_WIDTH, Math.random() * this.ROOM_MAX_HEIGHT),
      }, this.createEnemyContext()));
    }

    const projectilesObject = this.projectiles.update(deltaTime);
    const enemiesObject = this.updateEnemies(deltaTime);

    this.players.update({
      projectilesObject,
      enemiesObject,
      deltaTime,
    });
  }

  private updateEnemies(deltaTime: number) {
    let enemiesObject: EnemiesObject = {};

    [...this.enemies.keys()].forEach(key => {
      const enemy = this.enemies.get(key)!;
      enemy.update(deltaTime);

      if (enemy.isDead) {
        this.enemies.delete(key);
        return;
      }

      enemiesObject[key] = enemy;
    });

    return enemiesObject;
  }

  private getEnemies(): Enemy[] {
    const retrievedEnemies: Enemy[] = [];
    this.enemies.forEach(enemy => retrievedEnemies.push(enemy));
    return retrievedEnemies;
  }

  private createEnemyContext() {
    return {
      createProjectile: (projectile: Projectile) => this.projectiles.create(projectile),
      getPlayers: () => this.players.getPlayers(),
    };
  }
}

