import * as PIXI from 'pixi.js';
import Match from './scene/match';
import Rooms from './scene/rooms';
import Scene from './scene/scene';

export default class Game {
  private app: PIXI.Application;
  private webSocket: WebSocket;
  private currentScene!: Scene;

  constructor({ webSocket, app }: { webSocket: WebSocket, app: PIXI.Application }) {
    this.app = app;
    this.webSocket = webSocket;

    this.changeScene(Match);

    this.webSocket.addEventListener("open", (event) => {
      this.currentScene.onConnect();

      this.webSocket.addEventListener("message", (event) => this.onMessage(event));

      this.app.ticker.add((deltaTime: number) => {
        this.update(deltaTime);
        this.draw();
      });
    });
  }

  update(deltaTime: number) {
    this.currentScene.update(deltaTime);
  }

  draw() {
    this.currentScene.draw();
  }

  onMessage(event: MessageEvent) {
    this.currentScene.onMessage(event);
  }

  changeScene(scene: { new({ webSocket, app, game }: { webSocket: WebSocket, app: PIXI.Application, game: Game }): Scene }) {
    if (this.currentScene) {
      this.currentScene.destroyInput();
      this.app.stage.removeChild(this.currentScene.getContainer());
    }

    this.currentScene = new scene({
      webSocket: this.webSocket,
      app: this.app,
      game: this,
    });
    this.currentScene.init();
    this.currentScene.input();
    this.app.stage.addChild(this.currentScene.getContainer());
  }
}
