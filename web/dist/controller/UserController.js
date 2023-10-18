"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    index: function() {
        return index;
    },
    register: function() {
        return register;
    },
    store: function() {
        return store;
    }
});
const _User = /*#__PURE__*/ _interop_require_default(require("../model/User"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function index(ctx) {
    return ctx.render('user', {
        publicKey: ctx.session.publicKey
    });
}
async function store(ctx) {
    console.log(ctx.request.body);
    await _User.default.create(ctx.request.body);
    ctx.redirect('/login');
}
async function register(ctx) {
    return ctx.render('register');
}
