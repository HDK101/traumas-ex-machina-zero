import Player from "./player";
import WebSocket from "ws";
import WebSocketClientHandler from "../handler";

export interface PlayerConnection {
  socket: WebSocket;
  handler: WebSocketClientHandler;
  player: Player;
}
