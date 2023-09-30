import * as PIXI from 'pixi.js';
import Enemies from './enemy/enemies';
import Player from './player/player';
import Players from './player/players';
import Projectiles from './projectile/projectiles';
import Vector2 from './vector2';

export default class Game {
  private app: PIXI.Application;
  private webSocket: WebSocket;
  private currentPlayer!: Player;
  private shooting = false;

  private movingUp = false;
  private movingDown = false;
  private movingLeft = false;
  private movingRight = false;

  private playerLifeBar: PIXI.Graphics;

  private projectiles: Projectiles;
  private enemies: Enemies;
  private players: Players;
  
  private mousePosition: Vector2 = Vector2.zero();

  constructor({ webSocket, app }: { webSocket: WebSocket, app: PIXI.Application }) {
    this.app = app;
    this.webSocket = webSocket;
    this.playerLifeBar = new PIXI.Graphics();

    app.stage.addChild(this.playerLifeBar);

    this.projectiles = new Projectiles(app.stage);
    this.enemies = new Enemies(app.stage);
    this.players = new Players(app.stage);

    webSocket.addEventListener("open", () => this.onConnect());

    window.addEventListener("mousemove", (event) => {
      this.mousePosition.x = event.clientX;
      this.mousePosition.y = event.clientY;
    });
  }

  onConnect() {
    this.webSocket.send(JSON.stringify({
      type: 'CREATE_ROOM',
      // type: 'JOIN_ROOM',
    }));

    this.webSocket.addEventListener("message", (event) => this.onMessage(event));

    this.input();
    this.app.ticker.add((deltaTime: number) => {
      this.update(deltaTime);
    });
  }

  onMessage(event: MessageEvent) {
    const data = JSON.parse(event.data);
    const { projectiles, players, enemies, player } = data;

    this.currentPlayer = player;

    this.players.onMessage(players);
    this.projectiles.onMessage(projectiles);
    this.enemies.onMessage(enemies);
  }

  update(deltaTime: number) {
    this.webSocket.send(JSON.stringify({
        type: 'PLAYER_MOVE',
        moving: {
          up: this.movingUp,
          down: this.movingDown,
          left: this.movingLeft,
          right: this.movingRight,
        },
        shooting: this.shooting,
        mousePosition: this.mousePosition,
    }));

    this.players.update(deltaTime);
    this.enemies.update(deltaTime);
    this.projectiles.update(deltaTime);

    this.draw();
  }

  draw() {
    if (this.currentPlayer) {
      this.playerLifeBar.clear();
      this.playerLifeBar.beginFill(0xFFFF00);
      this.playerLifeBar.drawRect(16, 1, 100 * (this.currentPlayer?.life / 100), 32);
    }

    this.projectiles.render();
    this.enemies.render();
    this.players.render();
  }

  private input() {
    document.addEventListener("mousedown", (event: MouseEvent) => {
      if (event.button == 0) {
        this.shooting = true;
      }
    });

    document.addEventListener("mouseup", (event: MouseEvent) => {
      if (event.button == 0) {
        this.shooting = false;
      }
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
