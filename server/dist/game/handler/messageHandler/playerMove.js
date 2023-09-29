import Projectile, { ProjectileGroup, ProjectileType } from "../../projectile.js";
import Vector2 from "../../vector2.js";
function playerMove(webSocketClientHandler) {
    return (playerMessage)=>{
        const { player } = webSocketClientHandler;
        if (playerMessage.shooting) {
            webSocketClientHandler.getCurrentRoom()?.createProjectile(new Projectile({
                type: ProjectileType.PISTOL,
                group: ProjectileGroup.PLAYER,
                radius: 16,
                damage: 2,
                position: Object.create(player.position),
                velocity: Vector2.from(0.5, 0.5),
                timeToExpire: 10,
                speed: 300
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
    };
}
export const playerMoveHandler = {
    name: 'PLAYER_MOVE',
    handler: playerMove
};
