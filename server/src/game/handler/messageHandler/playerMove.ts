import WebSocketClientHandler from "../../handler.js";
import Projectile, {ProjectileGroup, ProjectileType} from "../../projectile/projectile.js";
import {PlayerMessage} from "../../types.js";
import Vector2 from "../../vector2.js";
import {MessageHandler} from "./MessageHandler.js";

function playerMove(webSocketClientHandler: WebSocketClientHandler) {
  return (playerMessage: PlayerMessage) => {
    const { player } = webSocketClientHandler;

    if (playerMessage.shooting) {
      player.projectiles?.create(new Projectile({
          type: ProjectileType.PISTOL,
          group: ProjectileGroup.PLAYER,
          radius: 16,
          damage: 2,
          position: Object.create(player.position),
          velocity: Vector2.from(0.5, 0.5),
          timeToExpire: 10,
          speed: 300,
        }));
    }

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

