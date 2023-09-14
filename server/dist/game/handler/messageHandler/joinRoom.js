function joinRoom(webSocketClientHandler) {
    return (playerMessage)=>{
        console.log(playerMessage);
        webSocketClientHandler.enterRoomById(playerMessage.roomId);
    };
}
export const joinRoomHandler = {
    name: 'JOIN_ROOM',
    handler: joinRoom
};
