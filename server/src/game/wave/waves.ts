import Enemies from "../enemy/enemies.js";
import Wave from "./wave.js";
import Wave1 from "./wave1.js";

export default class Waves {
  private _wave: number;

  private currentWave!: Wave;

  private waves: Wave[];

  constructor(enemies: Enemies) {
    this._wave = 1;
    this.waves = [
      new Wave1(enemies),
    ];
    this.next();
  }

  public update(deltaTime: number) {
    this.currentWave.update(deltaTime);
  }

  public get wave() {
    return this._wave;
  }

  private next() {
    const waveInRange = this.waves.filter(wave => this._wave >= wave.minWaveRange() && this._wave <= wave.maxWaveRange());
    this.currentWave = waveInRange[0];
  }
}
