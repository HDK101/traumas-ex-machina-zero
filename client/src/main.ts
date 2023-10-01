import * as PIXI from 'pixi.js';
import { Button } from '@pixi/ui';
import Game from './game';
import Polygon from './polygon';

import './style.css'
import {Container, DisplayObject} from 'pixi.js';

const app = new PIXI.Application({
  resizeTo: window,
  eventMode: 'passive',
  backgroundColor: '303030',
});

const container = new PIXI.Container();
app.stage.addChild(container);
const button = new Button(
      new PIXI.Graphics()
          .beginFill(0xFFFFFF)
          .drawRoundedRect(0, 0, 100, 50, 15)
);

const displayObject = (app.stage) as DisplayObject;
// container.addChild(button.view);

const webSocket = new WebSocket("ws://localhost:13200");

const game = new Game({
  webSocket,
  app,
});

document.body.appendChild(app.view as unknown as Node);

// app.stage.addChild(hexagon.graphics);

