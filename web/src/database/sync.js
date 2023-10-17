import User from "../model/User";
import Session from "../model/Session";

async function sync() {
    User.sync();
    Session.sync();
}

sync();