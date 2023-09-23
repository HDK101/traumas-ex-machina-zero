import * as PIXI from 'pixi.js';
import {Player} from "./player";

export default class Game {
  private app: PIXI.Application;
  private webSocket: WebSocket;
  private players: Player[];
  private shooting = false;

  private movingUp = false;
  private movingDown = false;
  private movingLeft = false;
  private movingRight = false;

  constructor({ webSocket, app }: { webSocket: WebSocket, app: PIXI.Application }) {
    this.app = app;
    this.players = [];
    this.webSocket = webSocket;

    webSocket.addEventListener("open", () => this.onConnect());
  }

  onConnect() {
    this.webSocket.send(JSON.stringify({
      type: 'CREATE_ROOM',
      // type: 'JOIN_ROOM',
    }));

    this.webSocket.addEventListener("message", (event) => this.onMessage(event));

    this.input();
    this.app.ticker.add((deltaTime: number) => {
      // hexagon.graphics.position.set(300, 300);
      this.update(deltaTime);
      this.draw();
    });
  }

  onMessage(event: MessageEvent) {
    const { x, y, projectiles, players, enemies } = JSON.parse(event.data);
  }

  update(deltaTime: number) {
    this.webSocket.send(JSON.stringify({
        type: 'PLAYER_MOVE',
        movingUp: this.movingUp,
        movingDown: this.movingDown,
        movingLeft: this.movingLeft,
        movingRight: this.movingRight,
        shooting: this.shooting,
    }));
  }

  draw() {
    
  }

  private input() {
    document.addEventListener("mousedown", (event: MouseEvent) => {
      this.shooting = true;
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "s") {
          this.movingDown = true;
        }
        else if (event.key === "w") {
          this.movingUp = true;
        }

        if (event.key === "d") {
          this.movingRight = true;
        }
        else if (event.key === "a") {
          this.movingLeft = true;
        }
    });

    document.addEventListener("keyup", (event) => {
        if (event.key === "s") {
          this.movingDown = false;
        }

        if (event.key === "w") {
          this.movingUp = false;
        }

        if (event.key === "d") {
          this.movingRight = false;
        }

        if (event.key === "a") {
          this.movingLeft = false;
        }
    });
  }

}
