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
    tick(deltaTime) {
        let projectilesList = [];
        this.currentTime += deltaTime;
        if (this.currentTime >= 1) {
            this.currentTime = 0;
            const projectile = {
                x: 0,
                y: 0
            };
            this.currentProjectileId += 1;
            this.projectiles.set(this.currentProjectileId, projectile);
        }
        this.projectiles.forEach((p)=>{
            p.x += 100 * deltaTime;
            p.y += 100 * deltaTime;
            projectilesList.push(p);
        });
        this.players.forEach((playerConnection)=>{
            const player = playerConnection.player;
            const socket = playerConnection.socket;
            player.x += player.velocityX * deltaTime;
            player.y += player.velocityY * deltaTime;
            socket.send(JSON.stringify({
                players: this.getPlayers(),
                x: player.x,
                y: player.y,
                projectiles: projectilesList
            }));
        });
    }
    formatted() {
        return {
            id: this.id,
            players: this.getPlayers()
        };
    }
    getPlayers() {
        const retrievedPlayers = [];
        this.players.forEach((playerConnection)=>retrievedPlayers.push(playerConnection.player));
        return retrievedPlayers;
    }
    constructor(id){
        _define_property(this, "id", void 0);
        _define_property(this, "players", void 0);
        _define_property(this, "currentProjectileId", void 0);
        _define_property(this, "projectiles", void 0);
        _define_property(this, "currentTime", void 0);
        this.id = id;
        this.players = new Map();
        this.currentProjectileId = 0;
        this.projectiles = new Map();
        this.currentTime = 0;
    }
}
export class Rooms {
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
    forEach(fn) {
        this.rooms.forEach(fn);
    }
    constructor(){
        _define_property(this, "rooms", void 0);
        _define_property(this, "currentRoomId", 0);
        this.rooms = new Map();
    }
}
