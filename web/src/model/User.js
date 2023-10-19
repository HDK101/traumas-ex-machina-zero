import { DataTypes } from "sequelize";
import sequelize from "../database/database"

const User = sequelize.define('User', {
    name: DataTypes.STRING,
    login: {
        type: DataTypes.STRING,
        unique: true,
    },
    maxScore: { 
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    enemiesKilled: { 
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    password: DataTypes.STRING,
});

export default User;