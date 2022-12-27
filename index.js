const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

let numConnections = 0;

app.use(express.static('public'))

io.on('connection', (socket) => {
    console.log('a user connected, current number of connections is ' + ++numConnections);

    socket.on('disconnect', () => {
      console.log('user disconnected, current number of connections is ' + --numConnections);
    });

    // TODO ?
    socket.on('dancer-registration', () => {

    });

    // TODO only dancer will be able to send the below events
    socket.on('dancer-data-unity', (data) => {
        //console.log("data received from dancer");
        //console.log(data);

        try {
            JSON.parse(data); // to check if a valid json is received
            //socket.broadcast.emit('dancer-data-node', data);
            io.emit('dancer-data-node', data);
        } catch (error) {
            console.log('received dancer data is invalid', error);
        }
    });

    socket.on('audience-data-unity', (data) => {
        try {
            JSON.parse(data); // to check if a valid json is received
            socket.broadcast.emit('dancer-data-node', data);
        } catch (error) {
            console.log('received dancer data is invalid', error);
        }
    });

    socket.on('start', () => {
        console.log('dance start event received')
        socket.broadcast.emit('dancer-started');
    });
});

server.listen(process.env.ATLANTA_PORT || 3000, () => {
  console.log('listening on *:3000');
});