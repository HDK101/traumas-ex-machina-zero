import {WebSocketServer} from "ws";
import WebSocketClientHandler from "./handler.js";
import Rooms from "./room/rooms.js";

export default class Server {
  private readonly ONE_MILLISECOND = 1000;

  private currentPlayerId = 0;

  private rooms: Rooms = new Rooms();

  private oldPerformanceNow = 0;
  private performanceNow = 0;

  private deltaSum = 0;
  private maxDeltaSum;

  constructor(private readonly ticksPerSecond: number = 60) {
    const wss = new WebSocketServer({
      port: 13200,
      perMessageDeflate: {
        zlibDeflateOptions: {
          chunkSize: 1024,
          memLevel: 7,
          level: 3,
        },
        zlibInflateOptions: {
          chunkSize: 10 * 1024,
        },
        clientNoContextTakeover: true,
        serverNoContextTakeover: true,
        serverMaxWindowBits: 10,
        concurrencyLimit: 10,
        threshold: 1024,
      },
    });

    this.maxDeltaSum = this.ONE_MILLISECOND / ticksPerSecond;

    wss.on("connection", (socket, request) => {
      this.currentPlayerId += 1;

      const webSocketClientHandler = new WebSocketClientHandler(
        this.currentPlayerId,
        socket,
        this.rooms,
      );
    });
  }

  tick() {
    this.rooms.forEach((room) => room.tick(1 / this.ticksPerSecond));
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
}
