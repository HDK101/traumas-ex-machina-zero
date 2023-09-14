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
  type: 'PLAYER_MOVE' | 'CREATE_ROOM' | 'JOIN_ROOM' | 'LIST_ROOMS';
  moving?: {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
  };
  roomId: number;
}
