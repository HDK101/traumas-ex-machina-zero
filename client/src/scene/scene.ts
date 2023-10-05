import * as PIXI from 'pixi.js';
import Game from '../game';

export default abstract class Scene {
  public readonly app: PIXI.Application;
  public readonly webSocket: WebSocket;
  public readonly game: Game;

  constructor({ webSocket, app, game }: { game: Game, webSocket: WebSocket, app: PIXI.Application }) {
    this.app = app;
    this.webSocket = webSocket;
    this.game = game;
  }

  abstract init(): void;
  abstract update(deltaTime: number): void;
  abstract draw(): void;
  abstract onMessage(event: MessageEvent): void;
  abstract onConnect(): void;
  abstract input(): void;
  abstract destroyInput(): void;
  abstract getContainer(): PIXI.Container;
}
