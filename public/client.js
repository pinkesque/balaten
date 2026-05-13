const socket = io();

canvas = document.getElementById('game');
ctx = canvas.getContext('2d');

canvas.addEventListener("contextmenu", e => {
	e.preventDefault();
});

function resize() {
	const dpr = window.devicePixelRatio || 1;
	
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	
	canvas.style.width = window.innerWidth + "px",
	canvas.style.height = window.innerHeight + "px"
	
	// ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

window.addEventListener("resize", resize);
resize();

function drawText(text, x, y, fontsize, justify) {
    ctx.font = fontsize + 'px funny';

    ctx.fillStyle = 'white';

    ctx.strokeStyle = 'black';
    ctx.lineCap = 'round';
    ctx.lineWidth = 8;

    if (justify === "center") {
        x -= ctx.measureText(text).width / 2;
    }

    if (justify === "right") {
        x -= ctx.measureText(text).width;
    }

    ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);
}

function drawTextCursor(x, y, fontsize, text, pos) {
    if (Math.floor(performance.now() / 500) % 2 === 0) {
        const beforeCursor = text.substring(0, input.selectionStart);
        ctx.font = fontsize + 'px funny';

        const textWidth = ctx.measureText(text).width;
        const beforeWidth = ctx.measureText(beforeCursor).width;

        ctx.fillStyle = "black";
        ctx.fillRect(x - textWidth / 2 + beforeWidth - 2, y - fontsize + 8, 4, fontsize);
    }
}

canvas.addEventListener("click", () => {
    input.focus();
});

notletters = ["Backspace", "Enter", "Shift", "Control", "Alt", "Meta", "CapsLock", "Tab", "Escape", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Dead", "AltGraph", "ContextMenu", "NumLock", "ScrollLock", "Pause", "Insert", "Home", "PageUp", "Delete", "End", "PageDown", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"];

document.addEventListener("keydown", (event) => {
    input.focus();

    if (!userSet) {
        if (event.key === "Enter") {
            socket.emit("username", document.getElementById("input").value);
        }
    } else {
        if (event.key === "Enter") {
            socket.emit("sendmessage", document.getElementById("input").value);
            document.getElementById("input").value = "";
        }
    }
});

socket.on("recievemessage", (data) => {
    messages.push(data);
    textY += 75;
});

socket.on("register", (tf,username) => {
    if (!tf) {
        alert("invalid: " + username);
    } else {
        userSet = true;
        username = username;
        document.getElementById("input").value = "";
    }
});

function update() {
    render();
    requestAnimationFrame(update);
}

var text = "yo";

var userSet = false;
var username = "";

let input;

let messages = [];

let textY = 0;

function init() {
    input = document.createElement("input");
    input.id = "input"; 
    input.type = "text";
    input.style.position = "absolute";
    input.style.left = "-9999px";
    input.style.top = "-9999px";
    input.value = "";
    document.body.appendChild(input);
    input.focus();

    update();
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    if (!userSet) {

        drawText("hello, what is your name :D", canvas.width / 2, canvas.height / 2 - 100, 64, "center");

        drawText(document.getElementById("input").value, canvas.width / 2, canvas.height / 2, 64, "center");
        drawTextCursor(canvas.width / 2, canvas.height / 2, 64, document.getElementById("input").value, "center");

        ctx.fillStyle = "black";
        ctx.fillRect(canvas.width / 2 - 50, 50, 100, 100);
        ctx.fillRect(0, 0, 100, 100);
        ctx.fillRect(canvas.width - 100, 0, 100, 100);

        ctx.restore();

    } else {

        ctx.fillStyle = 'black';
        ctx.fillRect(50, 50, 100, 100);

        ctx.restore();

        drawText("yo " + username, 60, 200, 64);
        drawText(document.getElementById("input").value, canvas.width / 2, canvas.height / 2, 64, "center");
        drawTextCursor(canvas.width / 2, canvas.height / 2, 64, document.getElementById("input").value, "center");

        textY = textY * 0.95;

        for (let i = messages.length; i > 0; i--) {
            const message = messages[i - 1];
            const text = message.username + ": " + message.message;
            drawText(text, 60, canvas.height * 0.95 - (messages.length - i) * 75 + textY, 64);
        }
    }
    ctx.restore();
}

init();