import WebSocketClientHandler from "../../handler.js";
import {PlayerMessage} from "../../types.js";
import {MessageHandler} from "./MessageHandler.js";

function playerMove(webSocketClientHandler: WebSocketClientHandler) {
  return (playerMessage: PlayerMessage) => {
    const { playerConnection } = webSocketClientHandler;

    const velocity = 100;
    let velocityX = 0;
    let velocityY = 0;
    
    if (webSocketClientHandler.playerConnection) {
      if (playerMessage.movingLeft) {
        velocityX -= velocity;
      }
      if (playerMessage.movingRight) {
        velocityX += velocity;
      }

      if (playerMessage.movingUp) {
        velocityY -= velocity;
      }
      if (playerMessage.movingDown) {
        velocityY += velocity;
      }

      playerConnection.player.velocityX = velocityX;
      playerConnection.player.velocityY = velocityY;
    }
  }
}

export const playerMoveHandler: MessageHandler = {
  name: 'PLAYER_MOVE',
  handler: playerMove,
};

