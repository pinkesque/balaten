const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public")); // send client side html and js to the client on connect

io.on('connection', (socket) => {
    console.log('HELP SOMEONE IS CONNECTING AAAA');

    socket.on("buttonPressed", () => {
        console.log("someone press button");

        io.emit("changeText", "omg it worked");
    })

    socket.on("keypress", (key) => {
        console.log("someone press key " + key);

        io.emit("changeText", key);
    });

    socket.on("disconnect", () => {
        console.log('user disconnect');
    });

    socket.on("username", (username) => {
        console.log('user id' + socket.id + " set to " + username);
        socket.username = username;
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});