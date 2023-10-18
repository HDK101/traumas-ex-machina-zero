import Vector2 from "../../vector2.js";
function playerMove(webSocketClientHandler) {
    return (playerMessage)=>{
        const { player } = webSocketClientHandler;
        const mousePosition = Vector2.fromRaw(playerMessage.mousePosition);
        player.target = mousePosition;
        player.shooting = playerMessage.shooting;
        const weaponId = playerMessage.weaponId;
        player.changeWeapon(weaponId);
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
