function playerMove(webSocketClientHandler) {
    return (playerMessage)=>{
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
    };
}
export const playerMoveHandler = {
    name: 'PLAYER_MOVE',
    handler: playerMove
};
