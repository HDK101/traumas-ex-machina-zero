import Scene from "./scene";
import * as PIXI from 'pixi.js';
import {RawVector2} from "../vector2";
import Match from "./match";

export default class Rooms extends Scene {
  private container!: PIXI.Container;

  private timeToListRooms: number = 0.0;

  init() {
    this.container = new PIXI.Container();

    this.webSocket.send(JSON.stringify({
      type: 'LIST_ROOMS',
    }));
  }

  onMessage(event: MessageEvent) {
    const message = JSON.parse(event.data);

    if (message.type === 'LIST_ROOMS') {
      this.container.removeChildren();

      const newButton = this.createNewRoomButton();
      newButton.eventMode = 'dynamic';

      newButton.position.x = this.app.renderer.width / 2 - 100;
      newButton.position.y = 100;

      newButton.on('mousedown', () => {
        this.webSocket.send(JSON.stringify({
          privateKey: this.game.privateKey,
          type: 'CREATE_ROOM',
        }));
        this.game.changeScene(Match);
        return;
      })

      this.container.addChild(newButton);

      message.rooms.forEach((room: any, key: any) => {
        const button = this.createButtonRoom({
          id: room.id,
          wave: room.wave,
          players: room.players.length,
          position: {
            x: this.app.renderer.width / 2 - 100,
            y: 220 + key * 120,
          }
        }); 
        this.container.addChild(button);
      });
    }
  }

  update(deltaTime: number) {
    this.timeToListRooms += deltaTime;

    if (this.timeToListRooms >= 5.0) {
      this.webSocket.send(JSON.stringify({
        type: 'LIST_ROOMS',
      }));
      this.timeToListRooms = 0.0;
    }
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

  private createNewRoomButton() {
    const sprite = PIXI.Sprite.from('src/assets/button.png');

    const roomText = new PIXI.Text(`Create room`, {
      fill: 'ffffff',
    });
    roomText.position = { x: 10, y: 40 };
    roomText.eventMode = 'none';

    // sprite.addChild(roomText);

    return sprite;
  }

  private createButtonRoom({ id, wave, players, position }: { id: number; wave: number; players: number; position: RawVector2 }) {
    const sprite = PIXI.Sprite.from('src/assets/button.png');

    sprite.eventMode = 'dynamic';

    sprite.on('mousedown', () => {
      this.webSocket.send(JSON.stringify({
        type: 'JOIN_ROOM',
        roomId: id,
        privateKey: this.game.privateKey,
      }));
      this.game.changeScene(Match);
    })

    sprite.position = position;
    const waveText = new PIXI.Text(`Wave ${wave}`, {
      fill: 'ffffff',
    });

    const playersText = new PIXI.Text(`Players ${players}/4`, {
      fill: 'ffffff',
    });

    sprite.addChild(waveText);
    sprite.addChild(playersText);

    waveText.position = { x: 10, y: 10 };
    playersText.position = { x: 10, y: 40 };

    return sprite;
  }
}
