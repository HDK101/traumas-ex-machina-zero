import Server from "./game/server.js";
const server = new Server();
function serverLoop() {
    server.process();
    setImmediate(serverLoop);
}
setImmediate(serverLoop);
