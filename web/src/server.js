import Koa from 'koa';
import { resolve } from 'node:path';
import koaEjs from 'koa-ejs';
import serve from 'koa-static';
import koaBody from 'koa-body';
import router from './routes';
import session from 'koa-session';
import { WebSocketServer } from 'ws';

import './database/database';
import './database/association';
import './database/sync';

import retrievePrivateKey from './messageHandler/retrievePrivateKey';
import Session from './model/Session';

async function updateGameEnd(data) {
  console.log(data);
  await Promise.all(data.gameEnds.map(async (gameEnd) => {
    console.log(gameEnd.privateKey);
    const session = await Session.findOne({
      where: {
        privateKey: gameEnd.privateKey,
      },
      include: ['User'],
    });

    const user = session.User;
    user.enemiesKilled += gameEnd.enemiesKilled;
    user.maxScore = gameEnd.score;
    
    await user.save();
  }));
}

const app = new Koa();
const wss = new WebSocketServer({
  port: 8080,
  perMessageDeflate: {
    zlibDeflateOptions: {
      // See zlib defaults.
      chunkSize: 1024,
      memLevel: 7,
      level: 3
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024
    },
    // Other options settable:
    clientNoContextTakeover: true, // Defaults to negotiated value.
    serverNoContextTakeover: true, // Defaults to negotiated value.
    serverMaxWindowBits: 10, // Defaults to negotiated value.
    // Below options specified as default values.
    concurrencyLimit: 10, // Limits zlib concurrency for perf.
    threshold: 1024 // Size (in bytes) below which messages
    // should not be compressed if context takeover is disabled.
  }
});

wss.on('connection', (ws) => {
  ws.on('message', (rawData) => {
    const data = JSON.parse(rawData);
    console.log(data);
    if (data.type === 'PRIVATE_KEY') {
      retrievePrivateKey(ws, data);
    }
    else if (data.type === 'GAME_END') {
      updateGameEnd(data);
    }
  });
});

app.keys = ['secret'];

app
  .use(session({
    sameSite: null,
  }, app))
  .use(serve('dist'))
  .use(koaBody());

koaEjs(app, {
  root: resolve('view'),
  layout: 'template',
  viewExt: 'html',
});

app.use(router.routes());

app.listen(3000);