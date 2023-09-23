import WebSocketClientHandler from "../../handler.js";
import {PlayerMessage} from "../../types.js";
import {MessageHandler} from "./MessageHandler.js";

function playerMove(webSocketClientHandler: WebSocketClientHandler) {
  return (playerMessage: PlayerMessage) => {
    const { player } = webSocketClientHandler;

    const velocity = 100;
    let velocityX = 0;
    let velocityY = 0;
    
    if (webSocketClientHandler.playerConnection) {
      if (playerMessage.moving?.left) {
        velocityX -= velocity;
      }
      if (playerMessage.moving?.right) {
        velocityX += velocity;
      }

      if (playerMessage.moving?.up) {
        velocityY -= velocity;
      }
      if (playerMessage.moving?.down) {
        velocityY += velocity;
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

