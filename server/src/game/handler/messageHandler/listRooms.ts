import WebSocketClientHandler from "../../handler";
import { PlayerMessage } from "../../player/playerMessage";
import {MessageHandler} from "./MessageHandler";

function listRooms(webSocketClientHandler: WebSocketClientHandler) {
  return (playerMessage: PlayerMessage) => {
    webSocketClientHandler.playerConnection.socket.send(JSON.stringify({
      type: 'LIST_ROOMS',
      rooms: webSocketClientHandler.rooms.retrieveAll()?.map(room => room.formatted()),
    }));
  };
}

export const listRoomsHandler: MessageHandler = {
  name: 'LIST_ROOMS',
  handler: listRooms,
};
