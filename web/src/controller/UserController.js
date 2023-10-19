import User from "../model/User";

export async function index(ctx) {
    const user = await User.findByPk(ctx.session.userId);

    return ctx.render('user', {
        publicKey: ctx.session.publicKey,
        user,
    });
}

export async function store(ctx) {
    console.log(ctx.request.body);
    await User.create(ctx.request.body);

    ctx.redirect('/login');
}

export async function register(ctx) {
    return ctx.render('register');
}