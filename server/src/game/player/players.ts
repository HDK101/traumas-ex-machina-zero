import {AmmosObject} from "../ammo/ammos";
import {EnemiesObject} from "../enemy/enemies";
import Projectiles, {ProjectilesObject} from "../projectile/projectiles";
import Vector2 from "../vector2";
import Player from "./player";
import {PlayerConnection} from "./playerConnection";

interface PlayersObject { [key: string]: Player}

export default class Players {
  private pool: Map<number, PlayerConnection> = new Map();

  constructor(private readonly projectiles: Projectiles) {}

  public update({
    ammosObject,
    projectilesObject,
    enemiesObject,
    deltaTime,
  }: {
    ammosObject: AmmosObject;
    projectilesObject: ProjectilesObject;
    enemiesObject: EnemiesObject;
    deltaTime: number;
  }) {
    const playersObject = this.retrievePlayersAsObject();

    this.pool.forEach(playerConnection => {
      const player = playerConnection.player;
      const socket = playerConnection.socket;

      player.update(deltaTime);

      socket.send(JSON.stringify({
        player: player.formatted(),
        players: playersObject,
        projectiles: projectilesObject,
        enemies: enemiesObject,
        ammos: ammosObject,
      }));
    });
  }

  public get all(): Player[] {
    return [...this.pool.values()].map(playerConnection => playerConnection.player);
  }

  public playersInRange(position: Vector2, radius: number) {
    const playersInRange = this.all.filter(player => player.position.squareDistance(position) <= Math.pow(radius + player.radius, 2));

    return playersInRange;
  }

  public addPlayer(playerConnection: PlayerConnection): void {
    playerConnection.player.projectiles = this.projectiles;
    this.pool.set(playerConnection.player.id, playerConnection);
  }

  public removePlayer(id: number) {
    this.pool.delete(id);
  }

  private retrievePlayersAsObject() {
    const playersObject: PlayersObject = {};
    const entries = [...this.pool.entries()];
    entries.forEach(([key, playerConnection]) => {
      playersObject[key] = playerConnection.player;
    });
    return playersObject;
  }
}
