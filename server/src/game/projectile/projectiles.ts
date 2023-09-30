import Enemy from "../enemy/enemy.js";
import Player from "../player/player.js";
import Projectile, {ProjectileGroup} from "./projectile.js";

export interface ProjectilesObject { [key: string]: Projectile }

type GetPlayersCallback = () => Player[];
type GetEnemiesCallback = () => Enemy[];

export default class Projectiles {
  private pool: Map<string, Projectile> = new Map();
  private unusedProjectileIds: string[] = [];
  private getPlayers!: GetPlayersCallback;
  private getEnemies!: GetEnemiesCallback;

  private readonly MAX_PROJECTILES = 1000;

  constructor() {
    this.unusedProjectileIds = Array.from(Array(this.MAX_PROJECTILES).keys()).map(key => String(key));
  }

  public initCallbacks({
    getPlayers,
    getEnemies,
  }: {
    getPlayers: GetPlayersCallback;
    getEnemies: GetEnemiesCallback;
  }) {
    this.getPlayers = getPlayers;
    this.getEnemies = getEnemies;
  }

  public create(projectile: Projectile) {
    if (this.unusedProjectileIds.length === 0) return;

    this.pool.set(this.unusedProjectileIds.shift()!, projectile);
  }

  public update(deltaTime: number): ProjectilesObject {
    const projectilesObject = Object.fromEntries(this.pool);

    const playersProjectiles = Object.values(projectilesObject).filter(projectile => projectile.group === ProjectileGroup.PLAYER);
    const enemyProjectiles = Object.values(projectilesObject).filter(projectile => projectile.group === ProjectileGroup.ENEMY);

    playersProjectiles.forEach(projectile => {
      this.checkCollisionEnemies(projectile);
    });

    enemyProjectiles.forEach(projectile => {
      this.checkCollisionPlayers(projectile);
    });

    Object.entries(projectilesObject).forEach(([key, projectile]) => {
      const { queuedToDeleted, expired } = projectile.update(deltaTime);
      if (expired || queuedToDeleted) {
        this.pool.delete(key);
        this.unusedProjectileIds.push(key);
        delete projectilesObject[key];
      }
    });

    return projectilesObject;
  }

  private checkCollisionPlayers(projectile: Projectile) {
    const playersInRange = this.getPlayers().filter(player => player.position.squareDistance(projectile.position) <= Math.pow(projectile.radius + player.radius, 2));

    playersInRange.forEach(player => player.damage(projectile.damage));
    
    if (playersInRange.length > 0) projectile.queueToDelete();
  }

  private checkCollisionEnemies(projectile: Projectile) {
    const enemiesInRange = this.getEnemies().filter(enemy => enemy.position.squareDistance(projectile.position) <= projectile.squaredRadius);
    console.log(enemiesInRange);

    enemiesInRange.forEach(enemy => enemy.damage(projectile.damage));

    if (enemiesInRange.length > 0) projectile.queueToDelete();
  }
}
