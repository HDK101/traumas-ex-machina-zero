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
import { ProjectileGroup } from "./projectile.js";
import Midwit from "./enemy/midwit.js";
import Vector2 from "./vector2.js";
export class Room {
    createProjectile(projectile) {
        if (this.unusedProjectileIds.length === 0) return;
        this.projectiles.set(this.unusedProjectileIds.shift(), projectile);
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
        this.currentTime += deltaTime;
        if (this.currentTime >= 1) {
            this.currentTime = 0;
            this.createEnemy(new Midwit({
                position: Vector2.from(Math.random() * this.ROOM_MAX_WIDTH, Math.random() * this.ROOM_MAX_HEIGHT)
            }, this.createEnemyContext()));
        }
        const projectilesObject = this.updateProjectiles(deltaTime);
        const enemiesObject = this.updateEnemies(deltaTime);
        this.updatePlayers({
            projectilesObject,
            enemiesObject,
            deltaTime
        });
    }
    updateEnemies(deltaTime) {
        let enemiesObject = {};
        [
            ...this.enemies.keys()
        ].forEach((key)=>{
            const enemy = this.enemies.get(key);
            enemy.update(deltaTime);
            enemiesObject[key] = enemy;
        });
        return enemiesObject;
    }
    updateProjectiles(deltaTime) {
        let projectilesObject = {};
        [
            ...this.projectiles.keys()
        ].forEach((key)=>{
            const projectile = this.projectiles.get(key);
            if (projectile.group === ProjectileGroup.ENEMY) {
                this.checkProjectileCollisionPlayers(projectile);
            } else if (projectile.group === ProjectileGroup.PLAYER) {
                this.checkProjectileCollisionEnemies(projectile);
            }
            const { queuedToDeleted, expired } = projectile.update(deltaTime);
            if (expired || queuedToDeleted) {
                this.projectiles.delete(key);
                this.unusedProjectileIds.push(key);
            } else {
                projectilesObject[key] = projectile;
            }
        });
        return projectilesObject;
    }
    retrievePlayersAsObject() {
        const playersObject = {};
        [
            ...this.players.keys()
        ].forEach((key)=>{
            playersObject[key] = this.players.get(key)?.player;
        });
        return playersObject;
    }
    updatePlayers({ projectilesObject, enemiesObject, deltaTime }) {
        const playersObject = this.retrievePlayersAsObject();
        this.players.forEach((playerConnection)=>{
            const player = playerConnection.player;
            const socket = playerConnection.socket;
            player.move(deltaTime);
            socket.send(JSON.stringify({
                player: player,
                players: playersObject,
                projectiles: projectilesObject,
                enemies: enemiesObject
            }));
        });
    }
    checkProjectileCollisionPlayers(projectile) {
        const playersInRange = this.getPlayers().filter((player)=>player.position.squareDistance(projectile.position) <= projectile.squaredRadius + player.radius);
        playersInRange.forEach((player)=>player.damage(projectile.damage));
        if (playersInRange.length > 0) projectile.queueToDelete();
    }
    checkProjectileCollisionEnemies(projectile) {
        const enemiesInRange = this.getEnemies().filter((enemy)=>enemy.position.squareDistance(projectile.position) <= projectile.squaredRadius);
        enemiesInRange.forEach((enemy)=>enemy.damage(projectile.damage));
        if (enemiesInRange.length > 0) projectile.queueToDelete();
    }
    getEnemies() {
        const retrievedEnemies = [];
        this.enemies.forEach((enemy)=>retrievedEnemies.push(enemy));
        return retrievedEnemies;
    }
    getPlayers() {
        const retrievedPlayers = [];
        this.players.forEach((playerConnection)=>retrievedPlayers.push(playerConnection.player));
        return retrievedPlayers;
    }
    createEnemyContext() {
        return {
            createProjectile: (projectile)=>this.createProjectile(projectile),
            getPlayers: ()=>this.getPlayers()
        };
    }
    constructor(id){
        _define_property(this, "id", void 0);
        _define_property(this, "players", void 0);
        _define_property(this, "enemies", void 0);
        _define_property(this, "currentEnemyId", void 0);
        _define_property(this, "projectiles", void 0);
        _define_property(this, "unusedProjectileIds", void 0);
        _define_property(this, "currentTime", void 0);
        _define_property(this, "MAX_PROJECTILES", void 0);
        _define_property(this, "ROOM_MAX_WIDTH", void 0);
        _define_property(this, "ROOM_MAX_HEIGHT", void 0);
        this.id = id;
        this.players = new Map();
        this.enemies = new Map();
        this.currentEnemyId = 0;
        this.projectiles = new Map();
        this.unusedProjectileIds = [];
        this.currentTime = 0;
        this.MAX_PROJECTILES = 1000;
        this.ROOM_MAX_WIDTH = 2000;
        this.ROOM_MAX_HEIGHT = 2000;
        this.unusedProjectileIds = Array.from(Array(this.MAX_PROJECTILES).keys());
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
