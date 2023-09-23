import Vector2 from "../vector2.js";
import Enemy from "./enemy.js";

export default class Midwit extends Enemy {
  private currentTime: number = 0;

  protected start() {
    this.life = 10;
  }

  public update(delta: number): void {
    this.currentTime += delta;
    if (this.currentTime >= 0.5) {
      this.context.createProjectile({
        radius: 2,
        damage: 2,
        position: Vector2.from(0, 0),
        velocity: Vector2.from(100, 50),
      });
      this.currentTime = 0;
    }
    console.log(this.context.getPlayers());
    console.log("midwit update", delta);
  }
}
