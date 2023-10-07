function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
class Wave {
    finished() {
        return this.currentQuantityOfInstantiatedEnemies >= this.maxEnemiesToInstantiate() && this.enemies.allAlive.length === 0;
    }
    canInstantiateEnemy() {
        return this.enemies.allAlive.length <= this.maxEnemiesAlive() && this.currentQuantityOfInstantiatedEnemies < this.maxEnemiesToInstantiate();
    }
    reset() {
        this.currentQuantityOfInstantiatedEnemies = 0;
    }
    createEnemy(enemy) {
        this.enemies.create(enemy);
        this.currentQuantityOfInstantiatedEnemies += 1;
    }
    constructor(enemies){
        _define_property(this, "enemies", void 0);
        _define_property(this, "currentQuantityOfInstantiatedEnemies", void 0);
        this.enemies = enemies;
        this.currentQuantityOfInstantiatedEnemies = 0;
    }
}
export { Wave as default };
