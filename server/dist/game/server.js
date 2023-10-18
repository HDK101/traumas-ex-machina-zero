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
import { WebSocketServer } from "ws";
import WebSocketClientHandler from "./handler.js";
import Rooms from "./room/rooms.js";
class Server {
    tick() {
        this.rooms.update(1 / this.ticksPerSecond);
    }
    process() {
        this.oldPerformanceNow = this.performanceNow;
        this.performanceNow = performance.now();
        this.deltaSum += this.performanceNow - this.oldPerformanceNow;
        if (this.deltaSum >= this.maxDeltaSum) {
            this.tick();
            this.deltaSum = 0;
        }
    }
    constructor(ticksPerSecond = 60){
        _define_property(this, "ticksPerSecond", void 0);
        _define_property(this, "ONE_MILLISECOND", void 0);
        _define_property(this, "currentPlayerId", void 0);
        _define_property(this, "rooms", void 0);
        _define_property(this, "oldPerformanceNow", void 0);
        _define_property(this, "performanceNow", void 0);
        _define_property(this, "deltaSum", void 0);
        _define_property(this, "maxDeltaSum", void 0);
        this.ticksPerSecond = ticksPerSecond;
        this.ONE_MILLISECOND = 1000;
        this.currentPlayerId = 0;
        this.rooms = new Rooms();
        this.oldPerformanceNow = 0;
        this.performanceNow = 0;
        this.deltaSum = 0;
        const wss = new WebSocketServer({
            port: 13200,
            perMessageDeflate: {
                zlibDeflateOptions: {
                    chunkSize: 1024,
                    memLevel: 7,
                    level: 3
                },
                zlibInflateOptions: {
                    chunkSize: 10 * 1024
                },
                clientNoContextTakeover: true,
                serverNoContextTakeover: true,
                serverMaxWindowBits: 10,
                concurrencyLimit: 10,
                threshold: 1024
            }
        });
        this.maxDeltaSum = this.ONE_MILLISECOND / ticksPerSecond;
        wss.on("connection", (socket, request)=>{
            this.currentPlayerId += 1;
            const webSocketClientHandler = new WebSocketClientHandler(this.currentPlayerId, socket, this.rooms);
        });
    }
}
export { Server as default };
