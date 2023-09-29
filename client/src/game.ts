import * as PIXI from 'pixi.js';
import {Player} from "./player";
import Polygon from './polygon';

export default class Game {
  private app: PIXI.Application;
  private webSocket: WebSocket;
  private players: Map<string, Player> = new Map();
  private currentPlayer?: Player | null;
  private shooting = false;

  private movingUp = false;
  private movingDown = false;
  private movingLeft = false;
  private movingRight = false;

  private playerLifeBar: PIXI.Graphics;
  private projectilesGraphics: Map<string, Polygon> = new Map();
  private enemyGraphics: Map<string, Polygon> = new Map();

  private readonly MAX_PROJECTILES = 1000;

  constructor({ webSocket, app }: { webSocket: WebSocket, app: PIXI.Application }) {
    this.app = app;
    this.currentPlayer = null;
    this.webSocket = webSocket;
    this.playerLifeBar = new PIXI.Graphics();

    app.stage.addChild(this.playerLifeBar);
    
    [...Array(this.MAX_PROJECTILES).keys()].forEach((key) => {
      const polygon = new Polygon({
        radius: 10,
        points: 5,
        pointWobbleIntensity: 0,
        angleOffset: (Math.PI / 3 + Math.PI / 4) / 2,
      });
      this.projectilesGraphics.set(String(key), polygon);

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
      this.update(deltaTime);
    });
  }

  onMessage(event: MessageEvent) {
    const data = JSON.parse(event.data);
    const { projectiles, players, enemies, player } = data;

    this.currentPlayer = player;


    Object.keys(players).forEach(key => {
      if (!this.players.has(key)) {
        const player = new Player();
        this.app.stage.addChild(player.polygon.graphics);
        this.players.set(key, player);
        player.polygon.graphics.position = players[key].position;
        return;
      }
      const player = this.players.get(key)!;
      player.polygon.graphics.position = players[key].position;
    });

    [...Array(this.MAX_PROJECTILES).keys()].forEach(key => {
      const keyString = String(key);
      const projectile = projectiles[key];
      const projectileGraphic = this.projectilesGraphics.get(keyString)!;

      if (!projectile) {
        projectileGraphic.enabled = false;
        return;
      }

      if (!this.projectilesGraphics.has(String(key))) {
        const polygon = new Polygon({
          points: 6,
          radius: 10,
          angleOffset: (Math.PI / 3 + Math.PI / 4) / 2,
          pointWobbleIntensity: 5,
        });
        this.projectilesGraphics.set(keyString, polygon);
        this.app.stage.addChild(polygon.graphics);
        polygon.enabled = true;
        polygon.graphics.position = projectiles[key].position;
        return;
      }
      projectileGraphic.enabled = true;
      projectileGraphic.graphics.position = projectiles[key].position;
    });

    Object.keys(enemies).forEach((key: string) => {
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

    this.updateEnemies(deltaTime);
    this.updatePlayers(deltaTime);
    this.updateProjectiles(deltaTime);

    this.draw();
  }

  draw() {
    if (this.currentPlayer) {
      this.playerLifeBar.clear();
      this.playerLifeBar.beginFill(0xFFFF00);
      this.playerLifeBar.drawRect(16, 1, 100 * (this.currentPlayer?.life / 100), 32);
    }

    this.drawProjectiles();
    this.drawEnemies();
    this.drawPlayers();
  }

  private putPlayers(players: any) {

  }

  private updateProjectiles(deltaTime: number) {
    [...Array(this.MAX_PROJECTILES).keys()].forEach((key) => {
      const projectileGraphic = this.projectilesGraphics.get(String(key))!;
      projectileGraphic.update(deltaTime);
    });
  }

  private drawProjectiles() {
    [...Array(this.MAX_PROJECTILES).keys()].forEach((key) => {
      const projectileGraphic = this.projectilesGraphics.get(String(key))!;
      projectileGraphic.render();
    });
  }

  private updatePlayers(deltaTime: number) {
    this.players.forEach((player) => {
      player.polygon.update(deltaTime);
    });
  }

  private drawPlayers() {
    this.players.forEach(player => player.polygon.render());
  }

  private updateEnemies(deltaTime: number) {
    [...this.enemyGraphics.values()].forEach(enemy => {
      enemy.update(deltaTime);
    });
  }

  private drawEnemies() {
    [...this.enemyGraphics.values()].forEach(enemy => {
      enemy.render();
    });
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
