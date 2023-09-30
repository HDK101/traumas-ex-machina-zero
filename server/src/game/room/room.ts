import { PlayerConnection, Player } from "../types.js";;
import Projectile from "../projectile/projectile.js";
import Enemy from "../enemy/enemy.js";
import Midwit from "../enemy/midwit.js";
import Vector2 from "../vector2.js";
import Projectiles, {ProjectilesObject} from "../projectile/projectiles.js";

interface EnemiesObject { [key: number]: Enemy }
interface PlayersObject { [key: number]: Player }

export default class Room {
  private players: Map<number, PlayerConnection> = new Map();
  private enemies: Map<number, Enemy> = new Map();
  private currentEnemyId = 0;

  private projectiles: Projectiles;

  private currentTime = 0;

  private readonly ROOM_MAX_WIDTH = 2000;
  private readonly ROOM_MAX_HEIGHT = 2000;

  constructor(public readonly id: number) {
    this.projectiles = new Projectiles(
      {
        getPlayers: () => this.getPlayers(),
        getEnemies: () => this.getEnemies(),
      }
    );
  }

  public createEnemy(enemy: Enemy) {
    this.enemies.set(this.currentEnemyId, enemy);
    this.currentEnemyId += 1;
  }

  public addPlayer(playerConnection: PlayerConnection): void {
    playerConnection.player.projectiles = this.projectiles;
    this.players.set(playerConnection.player.id, playerConnection);
  }

  public removePlayer(id: number) {
    this.players.delete(id);
  }

  public formatted() {
    return {
      id: this.id,
      players: this.getPlayers(),
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

    this.updatePlayers({
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


  private retrievePlayersAsObject() {
    const playersObject: PlayersObject = {};

    [...this.players.keys()].forEach(key => {
      playersObject[key] = this.players.get(key)?.player!;
    });

    return playersObject;
  }
  
  private updatePlayers({
    projectilesObject,
    enemiesObject,
    deltaTime,
  }: {
    projectilesObject: ProjectilesObject;
    enemiesObject: EnemiesObject;
    deltaTime: number;
  }) {
    const playersObject = this.retrievePlayersAsObject();

    this.players.forEach(playerConnection => {
      const player = playerConnection.player;
      const socket = playerConnection.socket;

      player.move(deltaTime);

      socket.send(JSON.stringify({
        player: player,
        players: playersObject,
        projectiles: projectilesObject,
        enemies: enemiesObject,
      }));
    });
  }


  private getEnemies(): Enemy[] {
    const retrievedEnemies: Enemy[] = [];
    this.enemies.forEach(enemy => retrievedEnemies.push(enemy));
    return retrievedEnemies;
  }

  private getPlayers(): Player[] {
    const retrievedPlayers : Player[] = [];
    this.players.forEach(playerConnection => retrievedPlayers.push(playerConnection.player));
    return retrievedPlayers;
  }

  private createEnemyContext() {
    return {
      createProjectile: (projectile: Projectile) => this.projectiles.create(projectile),
      getPlayers: () => this.getPlayers(),
    };
  }
}

