import WebSocketClientHandler from "../../handler";
import { PlayerMessage } from "../../player/playerMessage";
import {MessageHandler} from "./MessageHandler";

function joinRoom(webSocketClientHandler: WebSocketClientHandler) {
  return (playerMessage: PlayerMessage) => {
    webSocketClientHandler.player.privateKey = playerMessage.privateKey;
    webSocketClientHandler.enterRoomById(playerMessage.roomId);
  };
}

export const joinRoomHandler: MessageHandler = {
  name: 'JOIN_ROOM',
  handler: joinRoom,
};
