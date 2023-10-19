"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _koa = /*#__PURE__*/ _interop_require_default(require("koa"));
const _nodepath = require("node:path");
const _koaejs = /*#__PURE__*/ _interop_require_default(require("koa-ejs"));
const _koastatic = /*#__PURE__*/ _interop_require_default(require("koa-static"));
const _koabody = /*#__PURE__*/ _interop_require_default(require("koa-body"));
const _routes = /*#__PURE__*/ _interop_require_default(require("./routes"));
const _koasession = /*#__PURE__*/ _interop_require_default(require("koa-session"));
const _ws = require("ws");
require("./database/database");
require("./database/association");
require("./database/sync");
const _retrievePrivateKey = /*#__PURE__*/ _interop_require_default(require("./messageHandler/retrievePrivateKey"));
const _Session = /*#__PURE__*/ _interop_require_default(require("./model/Session"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
async function updateGameEnd(data) {
    await Promise.all(data.gameEnds.map(async (gameEnd)=>{
        const session = await _Session.default.findOne({
            where: {
                privateKey: gameEnd.privateKey
            },
            include: [
                'User'
            ]
        });
        const user = session.User;
        user.enemiesKilled += gameEnd.enemiesKilled;
        user.maxScore = gameEnd.score;
        await user.save();
    }));
}
const app = new _koa.default();
const wss = new _ws.WebSocketServer({
    port: 8080,
    perMessageDeflate: {
        zlibDeflateOptions: {
            // See zlib defaults.
            chunkSize: 1024,
            memLevel: 7,
            level: 3
        },
        zlibInflateOptions: {
            chunkSize: 10 * 1024
        },
        // Other options settable:
        clientNoContextTakeover: true,
        serverNoContextTakeover: true,
        serverMaxWindowBits: 10,
        // Below options specified as default values.
        concurrencyLimit: 10,
        threshold: 1024 // Size (in bytes) below which messages
    }
});
wss.on('connection', (ws)=>{
    ws.on('message', (rawData)=>{
        const data = JSON.parse(rawData);
        if (data.type === 'PRIVATE_KEY') {
            (0, _retrievePrivateKey.default)(ws, data);
        } else if (data.type === 'GAME_END') {
            updateGameEnd(data);
        }
    });
});
app.keys = [
    'secret'
];
app.use((0, _koasession.default)({
    sameSite: null
}, app)).use((0, _koastatic.default)('dist')).use((0, _koabody.default)());
(0, _koaejs.default)(app, {
    root: (0, _nodepath.resolve)('view'),
    layout: 'template',
    viewExt: 'html'
});
app.use(_routes.default.routes());
app.listen(3000);
