import {Container} from "pixi.js";
import Camera from "../camera/camera";
import Player from "./player";

export default class Players {
  private pool: Map<string, Player> = new Map();

  constructor(private readonly stage: Container, private readonly camera: Camera) {}

  public onMessage(rawPlayers: any) {
    Object.keys(rawPlayers).forEach(key => {
      const rawPlayer = rawPlayers[key];
      if (!this.pool.has(key)) {
        this.putPlayer(key, rawPlayer);
        return;
      }
      const player = this.pool.get(key)!;
      player.polygon.position = rawPlayer.position;
    });
  }

  public update(deltaTime: number) {
    this.pool.forEach((player) => {
      player.polygon.update(deltaTime);
    });
  }

  public render() {
    this.pool.forEach(player => player.polygon.render());
  }

  private putPlayer(key: string, rawPlayer: any) {
    const player = new Player(this.camera);
    this.stage.addChild(player.polygon.graphics);
    this.pool.set(key, player);
    player.polygon.position = rawPlayer.position;
  }
}
