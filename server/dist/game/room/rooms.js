function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
import Room from "./room.js";
class Rooms {
    create() {
        const room = new Room(this.currentRoomId);
        this.rooms.set(this.currentRoomId, room);
        this.currentRoomId += 1;
        return room;
    }
    retrieve(id) {
        return this.rooms.get(id);
    }
    retrieveAll() {
        const roomList = [];
        this.rooms.forEach((room)=>roomList.push(room));
        return roomList;
    }
    update(deltaTime) {
        [
            ...this.rooms.entries()
        ].forEach(([key, room])=>{
            const finished = room.tick(deltaTime);
            if (finished) {
                const formattedGameEnds = room.players.all.map((player)=>player.formattedGameEnd());
                this.backendWebSocket.send(JSON.stringify({
                    type: 'GAME_END',
                    gameEnds: formattedGameEnds
                }));
                this.rooms.delete(key);
            }
        });
    }
    constructor(backendWebSocket){
        _define_property(this, "backendWebSocket", void 0);
        _define_property(this, "rooms", void 0);
        _define_property(this, "currentRoomId", void 0);
        this.backendWebSocket = backendWebSocket;
        this.currentRoomId = 0;
        this.rooms = new Map();
    }
}
export { Rooms as default };
