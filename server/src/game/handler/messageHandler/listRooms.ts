import WebSocketClientHandler from "../../handler";
import {PlayerMessage} from "../../types";
import {MessageHandler} from "./MessageHandler";

function listRooms(webSocketClientHandler: WebSocketClientHandler) {
  return (playerMessage: PlayerMessage) => {
    webSocketClientHandler.playerConnection.socket.send(JSON.stringify({
      rooms: webSocketClientHandler.rooms.retrieveAll()?.map(room => room.formatted()),
    }));
  };
}

export const listRoomsHandler: MessageHandler = {
  name: 'LIST_ROOMS',
  handler: listRooms,
};