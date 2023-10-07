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
class Players {
    update({ ammosObject, projectilesObject, enemiesObject, deltaTime }) {
        const playersObject = this.retrievePlayersAsObject();
        this.pool.forEach((playerConnection)=>{
            const player = playerConnection.player;
            const socket = playerConnection.socket;
            player.update(deltaTime);
            socket.send(JSON.stringify({
                player: player.formatted(),
                players: playersObject,
                projectiles: projectilesObject,
                enemies: enemiesObject,
                ammos: ammosObject
            }));
        });
    }
    get all() {
        return [
            ...this.pool.values()
        ].map((playerConnection)=>playerConnection.player);
    }
    playersInRange(position, radius) {
        const playersInRange = this.all.filter((player)=>player.position.squareDistance(position) <= Math.pow(radius + player.radius, 2));
        return playersInRange;
    }
    addPlayer(playerConnection) {
        playerConnection.player.projectiles = this.projectiles;
        this.pool.set(playerConnection.player.id, playerConnection);
    }
    removePlayer(id) {
        this.pool.delete(id);
    }
    retrievePlayersAsObject() {
        const playersObject = {};
        const entries = [
            ...this.pool.entries()
        ];
        entries.forEach(([key, playerConnection])=>{
            playersObject[key] = playerConnection.player;
        });
        return playersObject;
    }
    constructor(projectiles){
        _define_property(this, "projectiles", void 0);
        _define_property(this, "pool", void 0);
        this.projectiles = projectiles;
        this.pool = new Map();
    }
}
export { Players as default };
