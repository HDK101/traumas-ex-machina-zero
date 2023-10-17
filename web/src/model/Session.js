import { DataTypes } from "sequelize";
import sequelize from "../database/database"

const Session = sequelize.define('Session', {
    publicKey: DataTypes.STRING,
    privateKey: DataTypes.STRING,
});

export default Session;