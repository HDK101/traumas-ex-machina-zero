import Enemy from "./enemy.js";

export default class Midwit extends Enemy {
  protected start() {
    this.life = 10;
  }

  public update(delta: number): void {
    console.log("midwit update", delta);
  }
}
