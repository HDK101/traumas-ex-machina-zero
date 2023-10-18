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
        this._waveTime += deltaTime;
        if (this.currentWave.finished()) {
            console.log('finished');
            this.next();
        }
    }
    get wave() {
        return this._wave;
    }
    get waveTime() {
        return this._waveTime;
    }
    get noMoreWave() {
        return this._noMoreWave;
    }
    next() {
        this._wave += 1;
        const waveInRange = this.waves.filter((wave)=>this._wave >= wave.minWaveRange() && this._wave <= wave.maxWaveRange());
        if (waveInRange.length === 0) {
            this._noMoreWave = true;
            return;
        }
        this.currentWave = waveInRange[0];
        this.currentWave.reset();
        this._waveTime = 0;
    }
    constructor(enemies){
        _define_property(this, "_wave", void 0);
        _define_property(this, "currentWave", void 0);
        _define_property(this, "waves", void 0);
        _define_property(this, "_waveTime", 0);
        _define_property(this, "_noMoreWave", false);
        this._wave = 0;
        this.waves = [
            new Wave1(enemies)
        ];
        this.next();
    }
}
export { Waves as default };
