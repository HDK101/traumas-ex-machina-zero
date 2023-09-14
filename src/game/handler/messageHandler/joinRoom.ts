import WebSocketClientHandler from "../../handler";
import {PlayerMessage} from "../../types";
import {MessageHandler} from "./MessageHandler";

function joinRoom(webSocketClientHandler: WebSocketClientHandler) {
  return (playerMessage: PlayerMessage) => {
    console.log(playerMessage);
    webSocketClientHandler.enterRoomById(playerMessage.roomId);
  };
}

export const joinRoomHandler: MessageHandler = {
  name: 'JOIN_ROOM',
  handler: joinRoom,
};
