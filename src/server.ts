/*
import { WebSocketServer } from "ws";
import {PlayerConnection, Player, PlayerMessage} from "./types";

let currentPlayerId = 0;

let currentRoomId = 0;
let currentRooms: Map<number, Room> = new Map();

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

wss.on('connection', function (ws, req) {
  currentPlayerId += 1;

  currentPlayerId += 1;
  let playerId = currentPlayerId;

  ws.on('message', function (data) {
    const message = data as Buffer;
    const playerMessage = JSON.parse(message.toString()) as PlayerMessage;

    if (playerMessage.type === 'CREATE_ROOM' || !room.started) {
      room = {
        started: true,
        id: currentRoomId,
        players: new Map(),
      };

      currentRoomId += 1;
      currentRooms.set(currentRoomId, room);

      room.players?.set(playerId, {
        player: {
          id: playerId,
          x: 0,
          y: 0,
          velocityX: 0,
          velocityY: 0,
        },
        socket: ws,
      });
    }
    else if (playerMessage.type === 'PLAYER_MOVE') {
      const playerConnection = room.players?.get(playerId);
      if (playerConnection) {
        const velocity = 100;
        let velocityX = 0;
        let velocityY = 0;

        if (playerMessage.movingLeft) {
          velocityX -= velocity;
        }
        if (playerMessage.movingRight) {
          velocityX += velocity;
        }

        if (playerMessage.movingUp) {
          velocityY -= velocity;
        }
        if (playerMessage.movingDown) {
          velocityY += velocity;
        }

        playerConnection.player.velocityX = velocityX;
        playerConnection.player.velocityY = velocityY;
      }
    }
  });

  ws.on('close', () => {
    room.players?.delete(playerId);
  })
});

let oldPerformanceNow = 0;
let performanceNow = 0;

let deltaSum = 0;

async function serverLoop() {
  oldPerformanceNow = performanceNow;
  performanceNow = performance.now();
  deltaSum += performanceNow - oldPerformanceNow;

  if (deltaSum >= 1000/60) {
    deltaSum = 0;

    currentRooms.forEach(room => {
      room.players?.forEach(playerConnection => {
        const player = playerConnection.player;
        const socket = playerConnection.socket;

        player.x += player.velocityX * (1/60);
        player.y += player.velocityY * (1/60);

        socket.send(JSON.stringify({
          x: player.x,
          y: player.y,
        }));
      });
    })
  }
  
  setImmediate(serverLoop);
}

setImmediate(serverLoop);

console.log('hello');
console.log('hello');
*/
