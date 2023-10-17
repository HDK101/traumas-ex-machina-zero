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
require("./database/database");
require("./database/association");
require("./database/sync");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const app = new _koa.default();
app.use((0, _koastatic.default)('dist')).use((0, _koabody.default)());
(0, _koaejs.default)(app, {
    root: (0, _nodepath.resolve)('view'),
    layout: 'template',
    viewExt: 'html'
});
app.use(_routes.default.routes());
app.listen(3000);
