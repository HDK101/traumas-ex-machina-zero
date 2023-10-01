import Midwit from "../enemy/midwit.js";
import Vector2 from "../vector2.js";
import Projectiles from "../projectile/projectiles.js";
import Players from "../player/players.js";
import Enemies from "../enemy/enemies.js";

export default class Room {
  public projectiles: Projectiles;
  public players: Players;
  public enemies: Enemies;

  private currentTime = 0;

  private readonly ROOM_MAX_WIDTH = 2000;
  private readonly ROOM_MAX_HEIGHT = 2000;

  constructor(public readonly id: number) {
    this.projectiles = new Projectiles();
    this.players = new Players(this.projectiles);
    this.enemies = new Enemies(this.players, this.projectiles);
    this.projectiles.initCallbacks({
      getPlayers: () => this.players.all,
      getEnemies: () => this.enemies.all,
    });
  }


  public formatted() {
    return {
      id: this.id,
      players: this.players.all,
    };
  }

  public tick(deltaTime: number) {
    this.currentTime += deltaTime;

    if (this.currentTime >= 1) {
      this.currentTime = 0;

      this.enemies.create(new Midwit({
        position: Vector2.from(Math.random() * this.ROOM_MAX_WIDTH, Math.random() * this.ROOM_MAX_HEIGHT),
      }, this.enemies.createEnemyContext()));
    }

    const projectilesObject = this.projectiles.update(deltaTime);
    const enemiesObject = this.enemies.update(deltaTime);

    this.players.update({
      projectilesObject,
      enemiesObject,
      deltaTime,
    });
  }
}

