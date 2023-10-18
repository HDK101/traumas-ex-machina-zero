"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "store", {
    enumerable: true,
    get: function() {
        return store;
    }
});
const _nodecrypto = /*#__PURE__*/ _interop_require_default(require("node:crypto"));
const _Session = /*#__PURE__*/ _interop_require_default(require("../model/Session"));
const _User = /*#__PURE__*/ _interop_require_default(require("../model/User"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function createKey() {
    return _nodecrypto.default.createHash('sha256').update(_nodecrypto.default.randomUUID()).digest("hex");
}
async function store(ctx) {
    const { login, password } = ctx.request.body;
    const user = await _User.default.findOne({
        where: {
            login,
            password
        }
    });
    if (!user) throw new Error();
    const session = await _Session.default.create({
        publicKey: createKey(),
        privateKey: createKey()
    });
    await user.addSession(session);
    ctx.session = {
        publicKey: session.publicKey
    };
    ctx.redirect('/users');
}
