import Koa from 'koa';
import { resolve } from 'node:path';
import koaEjs from 'koa-ejs';
import serve from 'koa-static';
import koaBody from 'koa-body';
import router from './routes';

import './database/database';
import './database/association';
import './database/sync';

const app = new Koa();

app.use(serve('dist')).use(koaBody());

koaEjs(app, {
  root: resolve('view'),
  layout: 'template',
  viewExt: 'html',
});

app.use(router.routes());

app.listen(3000);
