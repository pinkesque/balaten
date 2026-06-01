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
            checkClick(element, mouse.x, mouse.y);
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
            vars.textOffset += 1;
            if (vars.textOffset > vars.messages.length - 1) vars.textOffset = vars.messages.length - 1;
        }
        
        if (event.key === "ArrowDown") {
            vars.textOffset -= 1;
            if (vars.textOffset < 0) vars.textOffset = 0;
        }

    });

    document.addEventListener("wheel", e => {
        vars.textOffset -= e.deltaY / 100;
        if (vars.textOffset < 0) vars.textOffset = 0;
        if (vars.textOffset > vars.messages.length - 1) vars.textOffset = vars.messages.length - 1;
    })
}

export let mouse = {
    x: 0,
    y: 0
};

function checkClick(element, x, y) {
    if (element.type === "button" && element.contains(mouse.x, mouse.y)) {
        element.onClick();
    }

    for (const child of element.children) {
        checkClick(child, x, y)
    }
}