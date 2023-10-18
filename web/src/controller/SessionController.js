import crypto from 'node:crypto';
import Session from "../model/Session";
import User from "../model/User";

function createKey() {
    return crypto.createHash('sha256').update(crypto.randomUUID()).digest("hex");
}

export async function store(ctx) {
    const { login, password } = ctx.request.body;

    const user = await User.findOne({
        where: {
            login,
            password,
        },
    });

    if (!user) throw new Error();

    const session = await Session.create({
        publicKey: createKey(),
        privateKey: createKey(),
    });

    await user.addSession(session);

    ctx.session = {
        publicKey: session.publicKey,
    }

    ctx.redirect('/users');
}