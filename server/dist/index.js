import Server from "./game/server.js";
import { walter } from "../../common/index.js";
console.log(walter);
const server = new Server();
function serverLoop() {
    server.process();
    setImmediate(serverLoop);
}
setImmediate(serverLoop);
