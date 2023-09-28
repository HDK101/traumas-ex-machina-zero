import WebSocket from "ws";
import Vector2, {Vector2Object} from "./vector2.js";

export class Player {
  id: number;
  position: Vector2;
  velocity: Vector2;
  life: number = 100;

  readonly radius: number = 16;

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
    this.position.sum(this.velocity.multiply(delta));
  }

  public damage(value: number) {
    this.life -= value;
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
