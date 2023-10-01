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
import Wave1 from "./wave1.js";
class Waves {
    update(deltaTime) {
        this.currentWave.update(deltaTime);
    }
    get wave() {
        return this._wave;
    }
    next() {
        const waveInRange = this.waves.filter((wave)=>this._wave >= wave.minWaveRange() && this._wave <= wave.maxWaveRange());
        this.currentWave = waveInRange[0];
    }
    constructor(enemies){
        _define_property(this, "_wave", void 0);
        _define_property(this, "currentWave", void 0);
        _define_property(this, "waves", void 0);
        this._wave = 1;
        this.waves = [
            new Wave1(enemies)
        ];
        this.next();
    }
}
export { Waves as default };
