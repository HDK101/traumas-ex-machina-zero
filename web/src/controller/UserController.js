import User from "../model/User";

export async function store(ctx) {
    console.log(ctx.request.body);
    await User.create(ctx.request.body);

    ctx.redirect('/login');
}
export async function register(ctx) {
    return ctx.render('register');
}