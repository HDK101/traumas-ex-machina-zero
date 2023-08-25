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
                x: player.x,
                y: player.y,
                projectiles: projectilesList
            }));
        });
    }
    constructor(){
        _define_property(this, "players", new Map());
        _define_property(this, "currentProjectileId", 0);
        _define_property(this, "projectiles", new Map());
        _define_property(this, "currentTime", 0);
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
