function playerMove(webSocketClientHandler) {
    return (playerMessage)=>{
        const { player } = webSocketClientHandler;
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
