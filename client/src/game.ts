import * as PIXI from 'pixi.js';
import Match from './scene/match';
import Rooms from './scene/rooms';
import Scene from './scene/scene';

export default class Game {
  public privateKey!: string;

  private app: PIXI.Application;
  private webSocket: WebSocket;
  private backendWebSocket!: WebSocket;
  private currentScene!: Scene;

  constructor({ webSocket, app }: { webSocket: WebSocket, app: PIXI.Application }) {
    this.app = app;
    this.webSocket = webSocket;
    this.backendWebSocket = new WebSocket('ws://localhost:8080');

    this.backendWebSocket.addEventListener("open", event => {
      const urlParams = new URLSearchParams(window.location.search);

      this.backendWebSocket.send(JSON.stringify({
        type: 'PRIVATE_KEY',
        publicKey: urlParams.get('publicKey'),
      }));

      this.backendWebSocket.addEventListener("message", event => {
        const { privateKey, type, success } = JSON.parse(event.data);

        if (type !== 'PRIVATE_KEY') return;

        if (!success) window.location.href = "http://localhost:3000";

        this.privateKey = privateKey;
      });
    });

    
    this.webSocket.addEventListener("open", (event) => {
      this.webSocket.addEventListener("message", (event) => this.onMessage(event));
      
      this.app.ticker.add((deltaTime: number) => {
        this.update(deltaTime);
        this.draw();
      });
      
      this.changeScene(Rooms);
    });
  }

  update(deltaTime: number) {
    this.currentScene.update(deltaTime);
  }

  draw() {
    this.currentScene.draw();
  }

  onMessage(event: MessageEvent) {
    const data = JSON.parse(event.data);

    console.log(data);

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
