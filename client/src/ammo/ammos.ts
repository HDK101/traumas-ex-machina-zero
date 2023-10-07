import {Container} from "pixi.js";
import Camera from "../camera/camera";
import Ammo from "./ammo";

export default class Ammos {
  private pool: Map<string, Ammo> = new Map();
  private keys: string[] = [];

  private MAX_AMMOS = 1000;

  constructor(private readonly stage: Container, private readonly camera: Camera) {
    this.keys = Array.from(Array(this.MAX_AMMOS).keys()).map(key => String(key));
  }

  onMessage(rawAmmos: any) {
    console.log(rawAmmos);
    this.keys.forEach(key => {
      const rawAmmo = rawAmmos[key];
      if (!rawAmmo) {
        if (this.pool.has(key)) {
          this.stage.removeChild(this.pool.get(key)!.polygon.graphics);
          this.pool.delete(key);
        }
        return;
      }

      if (!this.pool.has(key)) {
        this.putAmmo(key, rawAmmo);
      }
      const ammo = this.pool.get(key)!;
      ammo.position = rawAmmo.position;
      ammo.polygon.enabled = true;
    });
  }

  update(deltaTime: number) {
    this.pool.forEach(ammo => ammo.update(deltaTime));
  }

  render() {
    this.pool.forEach(ammo => ammo.render());
  }

  private putAmmo(key: string, rawAmmo: any) {
    const ammo = new Ammo(this.camera);
    this.stage.addChild(ammo.polygon.graphics);
    this.pool.set(key, ammo);
    ammo.position = rawAmmo.position;
  }
}
