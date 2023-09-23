import { PlayerConnection, Player } from "./types.js";
import { Projectile } from "./projectile.js";
import Enemy from "./enemy/enemy.js";
import Midwit from "./enemy/midwit.js";
import Vector2, {multiplyVectorByValue, sumVectors} from "./vector2.js";

export class Room {
  private players: Map<number, PlayerConnection> = new Map();
  private enemies: Map<number, Enemy> = new Map();
  private currentProjectileId = 0;
  private currentEnemyId = 0;
  private projectiles: Map<number, Projectile> = new Map();

  private currentTime = 0;

  constructor(public readonly id: number) {}

  public createProjectile(projectile: Projectile) {
    this.projectiles.set(this.currentProjectileId, projectile);
    this.currentProjectileId += 1;
  }

  public createEnemy(enemy: Enemy) {
    this.enemies.set(this.currentEnemyId, enemy);
    this.currentEnemyId += 1;
  }

  public addPlayer(playerConnection: PlayerConnection): void {
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
    let projectilesList: Projectile[] = [];
    let enemiesList: Enemy[] = [];

    this.currentTime += deltaTime;

    this.enemies.forEach(enemy => {
      enemiesList.push(enemy);
    });

    if (this.currentTime >= 1) {
      this.currentTime = 0;

      this.createEnemy(new Midwit({
        createProjectile: (projectile: Projectile) => this.createProjectile(projectile),
        getPlayers: () => this.getPlayers(),
      }));
    }

    this.projectiles.forEach(p => {
      p.position.sum(p.velocity);

      projectilesList.push(p);
    });

    this.players.forEach(playerConnection => {
      const player = playerConnection.player;
      const socket = playerConnection.socket;

      player.move(deltaTime);

      socket.send(JSON.stringify({
        players: this.getPlayers(),
        player: player,
        projectiles: projectilesList,
        enemies: enemiesList,
      }));
    });

    this.enemies.forEach(enemy => {
      enemy.update(deltaTime);
    });
  }

  private getPlayers(): Player[] {
    const retrievedPlayers : Player[] = [];
    this.players.forEach(playerConnection => retrievedPlayers.push(playerConnection.player));
    return retrievedPlayers;
  }
}

export class Rooms {
  private rooms: Map<number, Room>;
  private currentRoomId = 0;

  constructor() {
    this.rooms = new Map();
  }

  create(): Room {
    const room: Room = new Room(this.currentRoomId);

    this.rooms.set(this.currentRoomId, room);

    this.currentRoomId += 1;

    return room;
  }

  retrieve(id: number): Room | undefined {
    return this.rooms.get(id);
  }

  retrieveAll(): Room[] {
    const roomList: Room[] = [];

    this.rooms.forEach(room => roomList.push(room));

    return roomList;
  }

  forEach(fn: (room: Room) => void) {
    this.rooms.forEach(fn);
  }
}
