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
const User = _database.default.define('User', {
    name: _sequelize.DataTypes.STRING,
    login: {
        type: _sequelize.DataTypes.STRING,
        unique: true
    },
    maxScore: {
        type: _sequelize.DataTypes.INTEGER,
        defaultValue: 0
    },
    enemiesKilled: {
        type: _sequelize.DataTypes.INTEGER,
        defaultValue: 0
    },
    password: _sequelize.DataTypes.STRING
});
const _default = User;
