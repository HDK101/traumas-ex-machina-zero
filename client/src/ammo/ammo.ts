import {Sprite} from "pixi.js";
import Camera from "../camera/camera";
import {RawVector2} from "../vector2";

export default class Ammo {
  public readonly pistolBox: Sprite
  public position: RawVector2 = { x: 0, y: 0 };

  constructor(private readonly camera: Camera) {
    this.pistolBox = Sprite.from('src/assets/pistolbox.png');
  }

  update(deltaTime: number) {
    this.pistolBox.position = this.position;
    this.pistolBox.position.x -= this.camera.position.x;
    this.pistolBox.position.y -= this.camera.position.y;
    this.pistolBox.position.x -= 16;
    this.pistolBox.position.y -= 16;
  }
}
