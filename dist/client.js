import WebSocket from "ws";
const ws = new WebSocket('ws://localhost:13200');
ws.on('open', function () {
    console.log('connected!');
    setInterval(function () {
        const data = {
            name: 'Walter',
            id: 1,
        };
        const bufferJson = Buffer.from(JSON.stringify(data));
        ws.send(bufferJson);
    }, 4000);
});
