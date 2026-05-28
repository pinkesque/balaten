import { vars } from "./state.js"
import { mainMenu } from "./menus.js"

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