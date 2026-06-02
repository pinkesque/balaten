import { io, server } from "./server.js"
import { createAccount } from "./account.js"
import { sendMessage, messages } from "./chat.js"
import { serverSearch, createServer, servers } from "./servers.js"

export function initNetwork() {
    io.on('connection', (socket) => {

        socket.on("buttonPressed", () => {
            // what
        })

        socket.on("keypress", (key) => {
            // why do i even need this
        });

        socket.on("disconnect", () => {
            // code
        });

        socket.on("username", (username) => {

            let status = createAccount(username);

            if (status.verified === true)
                socket.username = status.username;

                console.log("user id " + socket.id + " set to " + status.username);

                socket.emit(status.type, status.verified, status.username)

        });

        socket.on("sendmessage", (message) => {

            message = sendMessage(message)

            io.emit("recievemessage", {
                username: socket.username,
                message: message
            })

            console.log(socket.username + ": " + message);

            messages.push({username: socket.username, message: message})

        });

        socket.on("serversearch", () => {
            socket.emit("serverlist", serverSearch())
        })

        socket.on("joinserver", (server) => {
            console.log(socket.username + " is trying to join server " + server)
        })

        socket.on("createserver", (server) => {
            createServer(server)

            io.emit("serverlist", servers)
        })

    });

    server.listen(3000, () => {
        console.log('listening on *:3000');
    });
}