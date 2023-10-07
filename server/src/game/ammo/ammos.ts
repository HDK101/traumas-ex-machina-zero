import Players from "../player/players";
import Ammo from "./ammo";

export type CreateAmmo = (ammo: Ammo) => void;

export interface AmmosObject {
  [key: string]: Ammo;
}

export default class Ammos {
  private ammos: Map<string, Ammo>;
  private unusedKeys: string[];

  private readonly MAX_AMMOS = 1000;

  private readonly AMMO_RADIUS = 32;

  constructor(private readonly players: Players) {
    this.ammos = new Map();
    this.unusedKeys = Array.from(Array(this.MAX_AMMOS).keys()).map(key => String(key));
  }

  create(ammo: Ammo) {
    if (this.unusedKeys.length === 0) return;

    this.ammos.set(this.unusedKeys.shift()!, ammo);
  }

  update(deltaTime: number) {
    const ammosObject: AmmosObject = {};

    [...this.ammos.entries()].forEach(([key, ammo]) => {
      this.checkCollision(key, ammo);
      ammosObject[key] = ammo;
    });

    return ammosObject;
  }

  private checkCollision(key: string, ammo: Ammo) {
    const players = this.players.playersInRange(ammo.position, this.AMMO_RADIUS);

    if (players.length === 0) return;

    players[0].gainAmmo(ammo);
    this.ammos.delete(key);
  }
}
