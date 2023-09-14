function playerMove(webSocketClientHandler) {
    return (playerMessage)=>{
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
            player.velocityX = velocityX;
            player.velocityY = velocityY;
        }
    };
}
export const playerMoveHandler = {
    name: 'PLAYER_MOVE',
    handler: playerMove
};
