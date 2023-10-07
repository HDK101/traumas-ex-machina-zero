import Scene from "./scene";
import * as PIXI from 'pixi.js';

export default class Rooms extends Scene {
  private container!: PIXI.Container;

  init() {
    this.container = new PIXI.Container();

    const sprite = PIXI.Sprite.from('src/assets/button.png');

    sprite.eventMode = 'dynamic';
    sprite.on('click', () => {
      console.log('hello');
    })

    sprite.position = {
      x: this.app.renderer.width / 2,
      y: this.app.renderer.height / 2
    }

    const waveText = new PIXI.Text('Wave 1', {
      fill: 'ffffff',
    });

    const playersText = new PIXI.Text('Players 0/4', {
      fill: 'ffffff',
    });

    sprite.addChild(waveText);
    sprite.addChild(playersText);

    waveText.position = { x: 10, y: 10 };
    playersText.position = { x: 10, y: 40 };
    
    this.container.addChild(sprite);
  }

  onConnect() {
  }

  onMessage(event: MessageEvent) {
  }

  update(deltaTime: number) {
  }

  draw() {
  }

  showText(text: string, life: number) {
  }

  input() {
  }

  destroyInput(): void {
  }

  getContainer() {
    return this.container;
  }
}
