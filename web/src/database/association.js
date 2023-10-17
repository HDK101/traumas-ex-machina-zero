import User from "../model/User";
import Session from "../model/Session";

User.hasMany(Session);
Session.belongsTo(User);