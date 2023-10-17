import { DataTypes } from "sequelize";
import sequelize from "../database/database"
import User from "./User";

const Session = sequelize.define('User', {
    publicKey: DataTypes.STRING,
    privateKey: DataTypes.STRING,
});

Session.belongsTo(User);

export default Session;