import Enemy from "./enemy.js";
class Midwit extends Enemy {
    start() {
        this.life = 10;
    }
    update(delta) {
        console.log("midwit update", delta);
    }
}
export { Midwit as default };
