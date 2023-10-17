import User from "../model/User";

export async function store(ctx) {
    await User.create(ctx.request.body);

    ctx.redirect('/login');
}