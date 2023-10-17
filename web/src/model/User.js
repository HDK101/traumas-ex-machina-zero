import { DataTypes } from "sequelize";
import sequelize from "../database/database"
import Session from "./Session";

const User = sequelize.define('User', {
    name: DataTypes.STRING,
    login: {
        type: DataTypes.STRING,
        unique: true,
    },
    password: DataTypes.STRING,
});

User.hasMany(Session);

export default User;