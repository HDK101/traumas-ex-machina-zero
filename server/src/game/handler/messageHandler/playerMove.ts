import WebSocketClientHandler from "../../handler.js";
import Vector2 from "../../vector2.js";
import { PlayerMessage } from "../../player/playerMessage.js";
import {MessageHandler} from "./MessageHandler.js";

function playerMove(webSocketClientHandler: WebSocketClientHandler) {
  return (playerMessage: PlayerMessage) => {
    const { player } = webSocketClientHandler;
    const mousePosition = Vector2.fromRaw(playerMessage.mousePosition);

    player.target = mousePosition;
    player.shooting = playerMessage.shooting!;

    let velocityX = 0;
    let velocityY = 0;
    
    if (webSocketClientHandler.playerConnection) {
      if (playerMessage.moving?.left) {
        velocityX -= player.speed;
      }
      if (playerMessage.moving?.right) {
        velocityX += player.speed;
      }

      if (playerMessage.moving?.up) {
        velocityY -= player.speed;
      }
      if (playerMessage.moving?.down) {
        velocityY += player.speed;
      }

      player.velocity.x = velocityX;
      player.velocity.y = velocityY;
    }
  }
}

export const playerMoveHandler: MessageHandler = {
  name: 'PLAYER_MOVE',
  handler: playerMove,
};

