import Enemies from "../enemy/enemies.js";
import Wave from "./wave.js";
import Wave1 from "./wave1.js";

export default class Waves {
  private _wave: number;

  private currentWave!: Wave;

  private waves: Wave[];

  private _waveTime: number = 0;

  constructor(enemies: Enemies) {
    this._wave = 1;
    this.waves = [
      new Wave1(enemies),
    ];
    this.next();
  }

  public update(deltaTime: number) {
    this.currentWave.update(deltaTime);
    this._waveTime += deltaTime;

    if (this.currentWave.finished()) {
      this.next();
    }
  }

  public get wave() {
    return this._wave;
  }
  
  public get waveTime() {
    return this._waveTime;
  }

  private next() {
    this._wave += 1;
    const waveInRange = this.waves.filter(wave => this._wave >= wave.minWaveRange() && this._wave <= wave.maxWaveRange());
    this.currentWave = waveInRange[0];
    this._waveTime = 0;
  }
}
