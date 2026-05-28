import { vars, uiElements } from "./state.js"
import { socket } from "./network.js"

export function initInput() {
    document.addEventListener("mousemove", () => {
        mouse = {
            x: event.x,
            y: event.y
        }
    });

    document.addEventListener("mousedown", () => {
        vars.vinput.focus();

        for (const element of uiElements) {
            if (element.type === "button" && element.contains(mouse.x, mouse.y)) {
                element.onClick();
            }
        }   
    });

    document.addEventListener("keydown", (event) => {
        vars.vinput.focus();

        if (!vars.userSet) {
            if (event.key === "Enter") {
                socket.emit("username", vars.vinput.value);
            }
        } else if (event.key === "Enter") {
            socket.emit("sendmessage", vars.vinput.value);
            vars.vinput.value = "";
        }

        if (event.key === "ArrowUp") {
            textOffset += 1;
            if (textOffset > messages.length - 1) textOffset = messages.length - 1;
        }
        
        if (event.key === "ArrowDown") {
            textOffset -= 1;
            if (textOffset < 0) textOffset = 0;
        }

    });

    document.addEventListener("wheel", e => {
        textOffset -= e.deltaY / 100;
        if (textOffset < 0) textOffset = 0;
        if (textOffset > messages.length - 1) textOffset = messages.length - 1;
    })
}

export let mouse = {
    x: 0,
    y: 0
};