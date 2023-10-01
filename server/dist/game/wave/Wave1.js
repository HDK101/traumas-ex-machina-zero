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
import Midwit from "../enemy/midwit";
import Room from "../room/room";
import Vector2 from "../vector2";
import Wave from "./Wave";
class Wave1 extends Wave {
    minWaveRange() {
        return 1;
    }
    maxWaveRange() {
        return 3;
    }
    update(deltaTime) {
        this.currentTimeToCreate += deltaTime;
        if (this.currentTimeToCreate >= this.rateInSeconds && this.maxEnemiesAlive()) {
            this.createEnemy(new Midwit({
                position: Vector2.from(Math.random() * Room.MAX_WIDTH, Math.random() * Room.MAX_HEIGHT)
            }, this.enemies.createEnemyContext()));
            this.rateInSeconds /= 2;
            this.currentTimeToCreate = 0;
        }
    }
    maxEnemiesToInstantiate() {
        return 50;
    }
    maxEnemiesAlive() {
        return 10;
    }
    constructor(...args){
        super(...args);
        _define_property(this, "rateInSeconds", 10);
        _define_property(this, "currentTimeToCreate", 0);
    }
}
export { Wave1 as default };
