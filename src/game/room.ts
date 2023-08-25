import { PlayerConnection } from "./types.js";

interface Projectile {
  x: number;
  y: number;
}

export class Room {
  private players: Map<number, PlayerConnection> = new Map();
  private currentProjectileId = 0;
  private projectiles: Map<number, Projectile> = new Map();

  private currentTime = 0;

  public addPlayer(playerConnection: PlayerConnection): void {
    this.players.set(playerConnection.player.id, playerConnection);
  }

  public removePlayer(id: number) {
    this.players.delete(id);
  }

  public forEachPlayer(fn: (playerConnection: PlayerConnection) => void) {
    this.players.forEach(fn);
  }

  public tick(deltaTime: number) {
    let projectilesList: Projectile[] = [];

    this.currentTime += deltaTime;

    if (this.currentTime >= 1) {
      this.currentTime = 0;

      const projectile = {
        x: 0,
        y: 0,
      }

      this.currentProjectileId += 1;
      this.projectiles.set(this.currentProjectileId, projectile);
    }

    this.projectiles.forEach(p => {
      p.x += 100 * deltaTime;
      p.y += 100 * deltaTime;

      projectilesList.push(p);
    })

    this.players.forEach(playerConnection => {
      const player = playerConnection.player;
      const socket = playerConnection.socket;

      player.x += player.velocityX * deltaTime;
      player.y += player.velocityY * deltaTime;

      socket.send(JSON.stringify({
        x: player.x,
        y: player.y,
        projectiles: projectilesList,
      }));
    });
  }
}

export class Rooms {
  private rooms: Map<number, Room>;
  private currentRoomId = 0;

  constructor() {
    this.rooms = new Map();
  }

  create(): Room {
    this.currentRoomId += 1;

    const room: Room = new Room();

    this.rooms.set(this.currentRoomId, room);

    return room;
  }

  forEach(fn: (room: Room) => void) {
    this.rooms.forEach(fn);
  }
}
