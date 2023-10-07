import Enemies from "../enemy/enemies";
import Enemy from "../enemy/enemy";

export default abstract class Wave {
  protected currentQuantityOfInstantiatedEnemies: number = 0;

  constructor(protected readonly enemies: Enemies) {
  }

  public finished(): boolean {
    return this.currentQuantityOfInstantiatedEnemies >= this.maxEnemiesToInstantiate() && this.enemies.allAlive.length === 0;
  }

  public canInstantiateEnemy() {
    return this.enemies.allAlive.length <= this.maxEnemiesAlive() && this.currentQuantityOfInstantiatedEnemies < this.maxEnemiesToInstantiate();
  }

  public abstract maxEnemiesAlive(): number;

  public abstract minWaveRange(): number;

  public abstract maxWaveRange(): number;

  public abstract update(deltaTime: number): void;
  
  public abstract maxEnemiesToInstantiate(): number;

  public reset() {
    this.currentQuantityOfInstantiatedEnemies = 0;
  }

  protected createEnemy(enemy: Enemy) {
    this.enemies.create(enemy)
    this.currentQuantityOfInstantiatedEnemies += 1;
  };
}
