import Koa from 'koa';
import { resolve } from 'node:path';
import koaEjs from 'koa-ejs';
import serve from 'koa-static';

const app = new Koa();

app.use(serve('dist'));

koaEjs(app, {
  root: resolve('view'),
  layout: 'template',
  viewExt: 'html',
});

app.use(async (ctx) => {
  await ctx.render('user');
});

app.listen(3000);
