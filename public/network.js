import { vars, uiElements } from "./state.js"
import { mainMenu } from "./menus.js"
import { findUI } from "./ui.js"

export const socket = io();

socket.on("recievemessage", (data) => {
    vars.messages.push(data);
    vars.textY += 50;
});

socket.on("register", (tf,name) => {
    if (!tf) {
        alert("invalid: " + name);
    } else {
        vars.userSet = true;
        vars.username = name;
        document.getElementById("vinput").value = "";
        mainMenu();
    }
});

export function serverSearch() {
    socket.emit("serversearch")
}

socket.on("serverlist", (data) => {
    const list = findUI("serverList")
    console.log(list)
    list.data = Object.values(data)
})

export function joinServer(server) {
    socket.emit("joinserver", server)
}

export function createServer(servername, options) {
    socket.emit("createserver", servername, options)
}