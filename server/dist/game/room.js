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
import Midwit from "./enemy/midwit.js";
export class Room {
    createProjectile(projectile) {
        this.projectiles.set(this.currentProjectileId, projectile);
        this.currentProjectileId += 1;
    }
    createEnemy(enemy) {
        this.enemies.set(this.currentEnemyId, enemy);
        this.currentEnemyId += 1;
    }
    addPlayer(playerConnection) {
        this.players.set(playerConnection.player.id, playerConnection);
    }
    removePlayer(id) {
        this.players.delete(id);
    }
    formatted() {
        return {
            id: this.id,
            players: this.getPlayers()
        };
    }
    tick(deltaTime) {
        let projectilesList = [];
        let enemiesList = [];
        this.currentTime += deltaTime;
        this.enemies.forEach((enemy)=>{
            enemiesList.push(enemy);
        });
        if (this.currentTime >= 1) {
            this.currentTime = 0;
            this.createEnemy(new Midwit({
                createProjectile: (projectile)=>this.createProjectile(projectile),
                getPlayers: ()=>this.getPlayers()
            }));
        }
        this.projectiles.forEach((p)=>{
            p.position.sum(p.velocity);
            projectilesList.push(p);
        });
        this.players.forEach((playerConnection)=>{
            const player = playerConnection.player;
            const socket = playerConnection.socket;
            player.move(deltaTime);
            socket.send(JSON.stringify({
                players: this.getPlayers(),
                player: player,
                projectiles: projectilesList,
                enemies: enemiesList
            }));
        });
        this.enemies.forEach((enemy)=>{
            enemy.update(deltaTime);
        });
    }
    getPlayers() {
        const retrievedPlayers = [];
        this.players.forEach((playerConnection)=>retrievedPlayers.push(playerConnection.player));
        return retrievedPlayers;
    }
    constructor(id){
        _define_property(this, "id", void 0);
        _define_property(this, "players", void 0);
        _define_property(this, "enemies", void 0);
        _define_property(this, "currentProjectileId", void 0);
        _define_property(this, "currentEnemyId", void 0);
        _define_property(this, "projectiles", void 0);
        _define_property(this, "currentTime", void 0);
        this.id = id;
        this.players = new Map();
        this.enemies = new Map();
        this.currentProjectileId = 0;
        this.currentEnemyId = 0;
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
