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
export class Room {
    addPlayer(playerConnection) {
        this.players.set(playerConnection.player.id, playerConnection);
    }
    removePlayer(id) {
        this.players.delete(id);
    }
    forEachPlayer(fn) {
        this.players.forEach(fn);
    }
    constructor(){
        _define_property(this, "players", new Map());
    }
}
export class Rooms {
    create() {
        this.currentRoomId += 1;
        const room = new Room();
        this.rooms.set(this.currentRoomId, room);
        return room;
    }
    forEach(fn) {
        this.rooms.forEach(fn);
    }
    constructor(){
        _define_property(this, "rooms", void 0);
        _define_property(this, "currentRoomId", 0);
        this.rooms = new Map();
    }
}
