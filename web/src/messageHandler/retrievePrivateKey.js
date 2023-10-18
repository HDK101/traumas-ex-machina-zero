import Session from "../model/Session"

export default async function retrievePrivateKey(ws, data) {
    const session = await Session.findOne({
        where: {
            publicKey: data.publicKey,
        },
    });

    if (!session || session.used) {
        ws.send(JSON.stringify({
            type: 'PRIVATE_KEY',
            success: false,
        }));
        return;
    }

    session.used = true;
    await session.save();

    ws.send(JSON.stringify({
        type: 'PRIVATE_KEY',
        success: true,
        privateKey: session?.privateKey,
    }));
}