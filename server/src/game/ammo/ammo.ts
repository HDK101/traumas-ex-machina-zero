import Vector2 from '../vector2.js';
import { WeaponList } from '../weapon/weaponList.js';

export default class Ammo {
  constructor(
    public readonly position: Vector2,
    public readonly weapon: WeaponList,
    public readonly quantity: number
  ) {}
}
