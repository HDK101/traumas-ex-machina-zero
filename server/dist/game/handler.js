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
import Player from "./player/player.js";
import * as rawHandlers from "./handler/messageHandler/index.js";
import Vector2 from "./vector2.js";
class WebSocketClientHandler {
    enterRoomById(id) {
        this.inRoom = this.rooms.retrieve(id);
        this.inRoom?.players.addPlayer(this.playerConnection);
    }
    getCurrentRoom() {
        return this.inRoom;
    }
    constructor(playerId, webSocket, rooms){
        _define_property(this, "playerId", void 0);
        _define_property(this, "webSocket", void 0);
        _define_property(this, "rooms", void 0);
        _define_property(this, "playerConnection", void 0);
        _define_property(this, "player", void 0);
        _define_property(this, "inRoom", void 0);
        _define_property(this, "handlers", void 0);
        this.playerId = playerId;
        this.webSocket = webSocket;
        this.rooms = rooms;
        this.handlers = new Map();
        this.rooms = rooms;
        this.webSocket = webSocket;
        this.player = new Player({
            id: playerId,
            position: Vector2.zero()
        });
        this.playerConnection = {
            socket: webSocket,
            player: this.player
        };
        Object.values(rawHandlers).forEach((rawHandler)=>{
            this.handlers.set(rawHandler.name, rawHandler.handler(this));
        });
        const thisHandler = this;
        webSocket.on("message", (data)=>{
            const message = data;
            const playerMessage = JSON.parse(message.toString());
            if (playerMessage.type === 'CREATE_ROOM') {
                thisHandler.inRoom = thisHandler.rooms.create();
                thisHandler.inRoom.players.addPlayer(thisHandler.playerConnection);
            } else {
                const handlerFunction = thisHandler.handlers.get(playerMessage.type);
                if (handlerFunction) handlerFunction(playerMessage);
            }
        });
        webSocket.on("close", ()=>{
            thisHandler.inRoom?.players.removePlayer(thisHandler.playerId);
        });
    }
}
export { WebSocketClientHandler as default };
