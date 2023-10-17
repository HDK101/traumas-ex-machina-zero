"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _User = /*#__PURE__*/ _interop_require_default(require("../model/User"));
const _Session = /*#__PURE__*/ _interop_require_default(require("../model/Session"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
async function sync() {
    _User.default.sync();
    _Session.default.sync();
}
sync();
