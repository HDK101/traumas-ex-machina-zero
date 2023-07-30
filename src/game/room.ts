import { PlayerConnection } from "./types.js";

export class Room {
  private players: Map<number, PlayerConnection> = new Map();

  public addPlayer(playerConnection: PlayerConnection): void {
    this.players.set(playerConnection.player.id, playerConnection);
  }

  public removePlayer(id: number) {
    this.players.delete(id);
  }

  public forEachPlayer(fn: (playerConnection: PlayerConnection) => void) {
    this.players.forEach(fn);
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
