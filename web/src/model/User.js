import { DataTypes } from "sequelize";
import sequelize from "../database/database"

const User = sequelize.define('User', {
    name: DataTypes.STRING,
    login: {
        type: DataTypes.STRING,
        unique: true,
    },
    password: DataTypes.STRING,
});

export default User;