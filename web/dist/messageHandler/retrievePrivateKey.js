"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return retrievePrivateKey;
    }
});
const _Session = /*#__PURE__*/ _interop_require_default(require("../model/Session"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
async function retrievePrivateKey(ws, data) {
    const session = await _Session.default.findOne({
        where: {
            publicKey: data.publicKey
        }
    });
    if (!session || session.used) {
        ws.send(JSON.stringify({
            type: 'PRIVATE_KEY',
            success: false
        }));
        return;
    }
    session.used = true;
    await session.save();
    ws.send(JSON.stringify({
        type: 'PRIVATE_KEY',
        success: true,
        privateKey: session?.privateKey
    }));
}
