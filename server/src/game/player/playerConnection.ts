import Player from "./player";
import WebSocket from "ws";

export interface PlayerConnection {
  socket: WebSocket;
  player: Player;
}
