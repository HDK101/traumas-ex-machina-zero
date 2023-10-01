import * as PIXI from 'pixi.js';
import Camera from './camera/camera';
import Enemies from './enemy/enemies';
import Player from './player/player';
import Players from './player/players';
import Projectiles from './projectile/projectiles';
import Vector2 from './vector2';

export default class Game {
  private app: PIXI.Application;
  private webSocket: WebSocket;
  private shooting = false;

  private camera: Camera;

  private movingUp = false;
  private movingDown = false;
  private movingLeft = false;
  private movingRight = false;

  private playerLifeBar: PIXI.Graphics;

  private projectiles: Projectiles;
  private enemies: Enemies;
  private players: Players;
  
  private mousePosition: Vector2 = Vector2.zero();

  private middleText: PIXI.Text;
  private currentTextLife = 0.0;
  
  private currentPlayer!: any;

  private level: PIXI.Graphics;

  constructor({ webSocket, app }: { webSocket: WebSocket, app: PIXI.Application }) {
    this.app = app;
    this.webSocket = webSocket;
    this.playerLifeBar = new PIXI.Graphics();

    this.level = new PIXI.Graphics();

    this.level.beginFill(0x000000);
    this.level.drawRect(0, 0, 2000, 2000);

    app.stage.addChild(this.playerLifeBar);
    app.stage.addChild(this.level);

    this.camera = new Camera();

    this.projectiles = new Projectiles(app.stage, this.camera);
    this.enemies = new Enemies(app.stage, this.camera);
    this.players = new Players(app.stage, this.camera);

    this.middleText = new PIXI.Text('Game Over', {
      fontFamily: 'Arial',
      fontSize: 60,
      fill: 0xffffff,
      align: 'justify',
    });

    this.middleText.anchor.set(0.5, 0.5);
    this.app.stage.addChild(this.middleText);

    webSocket.addEventListener("open", () => this.onConnect());

    window.addEventListener("mousemove", (event) => {
      this.mousePosition.x = event.clientX;
      this.mousePosition.y = event.clientY;
    });

    this.showText("Game Over", 5.0);
  }

  onConnect() {
    this.webSocket.send(JSON.stringify({
      type: 'CREATE_ROOM',
      // type: 'JOIN_ROOM',
    }));

    this.webSocket.addEventListener("message", (event) => this.onMessage(event));

    this.input();
    this.app.ticker.add((deltaTime: number) => {
      this.level.position.x = -this.camera.position.x;
      this.level.position.y = -this.camera.position.y;
      this.middleText.position.x = this.app.renderer.width / 2;
      this.middleText.position.y = this.app.renderer.height / 2;
      this.update(deltaTime);
    });
  }

  onMessage(event: MessageEvent) {
    const data = JSON.parse(event.data);
    const { projectiles, players, enemies, player } = data;

    this.camera.position.x = player.position.x - this.app.renderer.width / 2;
    this.camera.position.y = player.position.y - this.app.renderer.height / 2;

    this.currentPlayer = player;

    this.players.onMessage(players);
    this.projectiles.onMessage(projectiles);
    this.enemies.onMessage(enemies);
  }

  update(deltaTime: number) {
    if (!this.currentPlayer) return;

    const calculatedMousePosition = this.mousePosition.clone();

    calculatedMousePosition.minus(Vector2.from(
      this.app.renderer.width / 2,
      this.app.renderer.height / 2,
    ));

    calculatedMousePosition.sum(Vector2.from(
      this.currentPlayer.position.x,
      this.currentPlayer.position.y,
    ));

    this.webSocket.send(JSON.stringify({
        type: 'PLAYER_MOVE',
        moving: {
          up: this.movingUp,
          down: this.movingDown,
          left: this.movingLeft,
          right: this.movingRight,
        },
        shooting: this.shooting,
        mousePosition: calculatedMousePosition,
    }));

    this.currentTextLife -= (deltaTime) / 60;
    if (this.currentTextLife <= 0) {
      this.middleText.text = "";
    }

    console.log(this.currentTextLife);

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

  showText(text: string, life: number) {
    this.middleText.text = text;
    this.currentTextLife = life;
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
