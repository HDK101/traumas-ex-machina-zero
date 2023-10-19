function joinRoom(webSocketClientHandler) {
    return (playerMessage)=>{
        webSocketClientHandler.player.privateKey = playerMessage.privateKey;
        webSocketClientHandler.enterRoomById(playerMessage.roomId);
    };
}
export const joinRoomHandler = {
    name: 'JOIN_ROOM',
    handler: joinRoom
};
