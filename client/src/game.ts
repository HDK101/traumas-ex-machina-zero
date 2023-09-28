import * as PIXI from 'pixi.js';
import {Player} from "./player";
import Polygon from './polygon';

export default class Game {
  private app: PIXI.Application;
  private webSocket: WebSocket;
  private players: Player[];
  private currentPlayer?: Player | null;
  private shooting = false;

  private movingUp = false;
  private movingDown = false;
  private movingLeft = false;
  private movingRight = false;

  private playerLifeBar: PIXI.Graphics;
  private projectilesGraphics: Polygon[] = [];
  private playerGraphics: Map<number, Polygon> = new Map();
  private enemyGraphics: Map<number, Polygon> = new Map();

  constructor({ webSocket, app }: { webSocket: WebSocket, app: PIXI.Application }) {
    this.app = app;
    this.players = [];
    this.currentPlayer = null;
    this.webSocket = webSocket;
    this.playerLifeBar = new PIXI.Graphics();

    app.stage.addChild(this.playerLifeBar);
    
    [...Array(10).keys()].forEach(() => {
      const polygon = new Polygon({
        radius: 10,
        points: 5,
        pointWobbleIntensity: 0,
        angleOffset: (Math.PI / 3 + Math.PI / 4) / 2,
      });
      this.projectilesGraphics.push(polygon);
      app.stage.addChild(polygon.graphics);
    });

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
    const data = JSON.parse(event.data);
    const { projectiles, players, enemies, player } = data;

    this.currentPlayer = player;

    this.projectilesGraphics.forEach(projectileGraphic => projectileGraphic.enabled = false);

    [...Array(players.length).keys()].forEach(key => {
      if (!this.playerGraphics.has(key)) {
        const polygon = new Polygon({
          points: 6,
          radius: 32,
          angleOffset: (Math.PI / 3 + Math.PI / 4) / 2,
          pointWobbleIntensity: 5,
        });
        this.app.stage.addChild(polygon.graphics);
        this.playerGraphics.set(key, polygon);
        return;
      }
      const polygon = this.playerGraphics.get(key)!;
      polygon.graphics.position = players[key].position;
    });

    [...Array(projectiles.length).keys()].forEach((key) => {
      if (!projectiles[key]) return;
      const projectileGraphic = this.projectilesGraphics[key];
      projectileGraphic.enabled = true;
      this.projectilesGraphics[key].graphics.position = projectiles[key].position;
    });

    [...Array(enemies.length).keys()].forEach((key) => {
      if (!this.enemyGraphics.has(key)) {
        const polygon = new Polygon({
          points: 6,
          radius: 32,
          angleOffset: (Math.PI / 3 + Math.PI / 4) / 2,
          pointWobbleIntensity: 5,
        });
        this.app.stage.addChild(polygon.graphics);
        this.enemyGraphics.set(key, polygon);
      }
      const polygon = this.enemyGraphics.get(key)!;
      polygon.graphics.position = enemies[key].position;
    });
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
    }));

    this.projectilesGraphics.forEach((projectileGraphic) => {
      projectileGraphic.update(deltaTime);
    });

    [...this.playerGraphics.values()].forEach(player => {
      player.update(deltaTime);
    });
    
    [...this.enemyGraphics.values()].forEach(enemy => {
      enemy.update(deltaTime);
    });
  }

  draw() {
    if (this.currentPlayer) {
      this.playerLifeBar.clear();
      this.playerLifeBar.beginFill(0xFFFF00);
      this.playerLifeBar.drawRect(16, 1, 100 * (this.currentPlayer?.life / 100), 32);
    }
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
        console.log(event);
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
