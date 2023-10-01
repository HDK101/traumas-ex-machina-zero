import Projectiles from "../projectile/projectiles.js";
import Players from "../player/players.js";
import Enemies from "../enemy/enemies.js";
import Waves from "../wave/waves.js";

export default class Room {
  public projectiles: Projectiles;
  public players: Players;
  public enemies: Enemies;

  public waves: Waves;

  public static readonly MAX_WIDTH = 2000;
  public static readonly MAX_HEIGHT = 2000;

  constructor(public readonly id: number) {
    this.projectiles = new Projectiles();
    this.players = new Players(this.projectiles);
    this.enemies = new Enemies(this.players, this.projectiles);
    this.projectiles.initCallbacks({
      getPlayers: () => this.players.all,
      getEnemies: () => this.enemies.all,
    });
    this.waves = new Waves(this.enemies);
  }


  public formatted() {
    return {
      id: this.id,
      players: this.players.all,
    };
  }

  public tick(deltaTime: number) {
    const projectilesObject = this.projectiles.update(deltaTime);
    const enemiesObject = this.enemies.update(deltaTime);

    this.waves.update(deltaTime);

    this.players.update({
      projectilesObject,
      enemiesObject,
      deltaTime,
    });
  }
}

