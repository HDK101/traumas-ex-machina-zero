function listRooms(webSocketClientHandler) {
    return (playerMessage)=>{
        webSocketClientHandler.playerConnection.socket.send(JSON.stringify({
            rooms: webSocketClientHandler.rooms.retrieveAll()?.map((room)=>room.formatted())
        }));
    };
}
export const listRoomsHandler = {
    name: 'LIST_ROOMS',
    handler: listRooms
};
