import Player from "./player/player.js";
import { PlayerConnection } from "./player/playerConnection.js";
import { PlayerMessage } from "./player/playerMessage.js";
import WebSocket from "ws";
import Room from "./room/room.js";
import Rooms from "./room/rooms.js";
import {HandlerFunction} from "./handler/messageHandler/HandlerFunction.js";
import * as rawHandlers from './handler/messageHandler/index.js';
import Vector2 from "./vector2.js";

export default class WebSocketClientHandler {
  public readonly playerConnection: PlayerConnection;
  public readonly player: Player;
  private inRoom?: Room | null;
  private handlers: Map<string, HandlerFunction> = new Map();

  constructor(
    private readonly playerId: number, 
    private readonly webSocket: WebSocket, 
    public readonly rooms: Rooms
  ) {
    this.rooms = rooms;
    this.webSocket = webSocket;

    this.player = new Player({
      id: playerId,
      position: Vector2.zero(),
    });

    this.playerConnection = {
      socket: webSocket,
      handler: this,
      player: this.player,
    };

    Object.values(rawHandlers).forEach(rawHandler => {
      this.handlers.set(rawHandler.name, rawHandler.handler(this));
    });

    const thisHandler = this;

    webSocket.on("message", (data: unknown) => {
      const message = data as Buffer;
      const playerMessage = JSON.parse(message.toString()) as PlayerMessage;

      if (playerMessage.type === 'CREATE_ROOM') {
        thisHandler.inRoom = thisHandler.rooms.create();
        thisHandler.inRoom.players.addPlayer(thisHandler.playerConnection);
      }
      else { 
        const handlerFunction = thisHandler.handlers.get(playerMessage.type);
        if (handlerFunction) handlerFunction(playerMessage);
      }
    });
    webSocket.on("close", () => {
      thisHandler.inRoom?.players.removePlayer(thisHandler.playerId);
    });
  }

  public enterRoomById(id: number) {
    this.inRoom = this.rooms.retrieve(id);
    this.inRoom?.players.addPlayer(this.playerConnection);
  }

  public exitRoom() {
    this.inRoom?.players.removePlayer(this.playerId);
  }

  public getCurrentRoom() {
    return this.inRoom;
  }
}
