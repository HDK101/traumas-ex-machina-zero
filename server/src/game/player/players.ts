import {EnemiesObject} from "../enemy/enemies";
import Projectiles, {ProjectilesObject} from "../projectile/projectiles";
import Player from "./player";
import {PlayerConnection} from "./playerConnection";

interface PlayersObject { [key: string]: Player}

export default class Players {
  private pool: Map<number, PlayerConnection> = new Map();

  constructor(private readonly projectiles: Projectiles) {}

  public update({
    projectilesObject,
    enemiesObject,
    deltaTime,
  }: {
    projectilesObject: ProjectilesObject;
    enemiesObject: EnemiesObject;
    deltaTime: number;
  }) {
    const playersObject = this.retrievePlayersAsObject();

    this.pool.forEach(playerConnection => {
      const player = playerConnection.player;
      const socket = playerConnection.socket;

      player.move(deltaTime);

      socket.send(JSON.stringify({
        player: player.formatted(),
        players: playersObject,
        projectiles: projectilesObject,
        enemies: enemiesObject,
      }));
    });
  }

  public getPlayers(): Player[] {
    return [...this.pool.values()].map(playerConnection => playerConnection.player);
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
