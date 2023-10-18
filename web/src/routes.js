import Router from "koa-router";
import * as LoginController from './controller/LoginController';
import * as UserController from './controller/UserController';
import * as SessionController from './controller/SessionController';

const router = new Router();

router.get('/login', LoginController.login);
router.get('/register', UserController.register);
router.post('/sessions', SessionController.store);
router.post('/users', UserController.store);
router.get('/users', UserController.index);
router.get('(.*)', (ctx) => {
    ctx.redirect('/login');
});

export default router;