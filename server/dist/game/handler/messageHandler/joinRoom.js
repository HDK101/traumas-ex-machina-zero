function joinRoom(webSocketClientHandler) {
    return (playerMessage)=>{
        webSocketClientHandler.enterRoomById(playerMessage.roomId);
    };
}
export const joinRoomHandler = {
    name: 'JOIN_ROOM',
    handler: joinRoom
};
