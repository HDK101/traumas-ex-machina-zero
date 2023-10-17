import Session from "../model/Session";
import User from "../model/User";

async function store(ctx) {
    const { login, password } = ctx.request.body;

    const user = await User.findOne({
        where: {
            login,
            password,
        },
    });

    if (!user) throw new Error();

    const session = await Session.create({
        publicKey: 'asd',
        privateKey: 'asd',
    });
}