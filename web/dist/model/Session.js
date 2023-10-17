"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _sequelize = require("sequelize");
const _database = /*#__PURE__*/ _interop_require_default(require("../database/database"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const Session = _database.default.define('Session', {
    publicKey: _sequelize.DataTypes.STRING,
    privateKey: _sequelize.DataTypes.STRING
});
const _default = Session;
