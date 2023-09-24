import WebSocket from "ws";
import Vector2, {Vector2Object} from "./vector2.js";

export class Player {
  id: number;
  position: Vector2;
  velocity: Vector2;

  constructor({
    id,
    position,
  }: {
    id: number;
    position: Vector2;
  }) {
    this.id = id;
    this.position = position;
    this.velocity = Vector2.zero();
  }

  public move(delta: number) {
    console.log(this.velocity.multiply(delta));
    this.position.sum(this.velocity.multiply(delta));
  }
}

export interface PlayerConnection {
  socket: WebSocket;
  player: Player;
}

export interface PlayerMessage {
  type: 'PLAYER_MOVE' | 'CREATE_ROOM' | 'JOIN_ROOM' | 'LIST_ROOMS';
  moving?: {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
  };
  roomId: number;
}
