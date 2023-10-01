import Midwit from "../enemy/midwit.js";
import Room from "../room/room.js";
import Vector2 from "../vector2.js";
import Wave from "./wave.js";

export default class Wave1 extends Wave {
  private rateInSeconds: number = 10;
  private currentTimeToCreate = 2;

  public minWaveRange(): number {
    return 1;
  }

  public maxWaveRange(): number {
    return 3;
  }

  public update(deltaTime: number): void {
    this.currentTimeToCreate += deltaTime;

    if (this.currentTimeToCreate >= this.rateInSeconds && this.canInstantiateEnemy()) {
      this.createEnemy(new Midwit({
        position: Vector2.from(Math.random() * Room.MAX_WIDTH, Math.random() * Room.MAX_HEIGHT),
      }, this.enemies.createEnemyContext()));
      this.rateInSeconds /= 2;
      this.rateInSeconds = Math.max(this.rateInSeconds, 1);
      this.currentTimeToCreate = 0;
    }
  }

  public maxEnemiesToInstantiate(): number {
    return 50;
  }

  public maxEnemiesAlive() {
    return 5;
  }
}
