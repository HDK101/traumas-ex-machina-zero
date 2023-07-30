import WebSocket from "ws";

export interface Player {
  id: number;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
}

export interface PlayerConnection {
  socket: WebSocket;
  player: Player;
}

export interface PlayerMessage {
  type: 'PLAYER_MOVE' | 'CREATE_ROOM';
  movingUp: boolean;
  movingDown: boolean;
  movingLeft: boolean;
  movingRight: boolean;
}
