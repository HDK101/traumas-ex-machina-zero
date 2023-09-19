import * as PIXI from 'pixi.js';
import Game from './game';
import Polygon from './polygon';

import './style.css'

const app = new PIXI.Application({
  resizeTo: window,
});

const webSocket = new WebSocket("ws://localhost:13200");

const game = new Game({
  webSocket,
  app,
});

document.body.appendChild(app.view as unknown as Node);

// app.stage.addChild(hexagon.graphics);

