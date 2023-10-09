import Projectiles from "../projectile/projectiles.js";
import Players from "../player/players.js";
import Enemies from "../enemy/enemies.js";
import Waves from "../wave/waves.js";
import Ammos from "../ammo/ammos.js";

export default class Room {
  public timeElapsed = 0.0;
  public projectiles: Projectiles;
  public players: Players;
  public enemies: Enemies;
  public ammos: Ammos;

  public waves: Waves;

  public static readonly MAX_WIDTH = 2000;
  public static readonly MAX_HEIGHT = 2000;

  constructor(public readonly id: number) {
    this.projectiles = new Projectiles();
    this.players = new Players(this.projectiles);
    this.ammos = new Ammos(this.players);
    this.enemies = new Enemies(this.players, this.projectiles, this.ammos);
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
      wave: this.waves.wave,
    };
  }

  public tick(deltaTime: number) {
    this.timeElapsed += deltaTime;

    const projectilesObject = this.projectiles.update(deltaTime);
    const enemiesObject = this.enemies.update(deltaTime);
    const ammosObject = this.ammos.update(deltaTime);

    this.waves.update(deltaTime);

    this.players.update({
      ammosObject,
      projectilesObject,
      enemiesObject,
      deltaTime,
      waveInfo: {
        currentTime: this.waves.waveTime,
        wave: this.waves.wave,
        finished: this.waves.noMoreWave,
      },
    });

    return this.waves.noMoreWave || (this.players.all.length === 0 && this.timeElapsed > 5);
  }
}

