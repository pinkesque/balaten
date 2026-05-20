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
    ctx.lineJoin = 'round';
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

function drawButton(text, x, y, width, height, func) {
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 8;

    ctx.fillRect(x, y, width, height);
    ctx.strokeRect(x, y, width, height);

    drawText(text, x + width / 2, y + height / 2 + 20, 64, "center");

    // im stuck cause i want to add a button but i dont know how to check if the mouse is clicking it without using html elements and css :D
}

const uiElements = [];

class UIElement {
    constructor(x, y, width, height, justify, opacity) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.justify = justify;

        this.opacity = opacity;
    }

    contains(x, y) {
        return(
            x > this.x && 
            x < this.x + this.wdith &&
            y > this.y &&
            y < this.y + this.height
        );
    }
}

class Button extends UIElement {
    constructor(x, y, width, height, opacity, func) {
        super(x, y, width, height, opacity);

        this.type = "button";
        this.func = func;
    }
}

class Text extends UIElement {
    constructor(text, x, y, opacity, fontsize, justify) {
        super(x, y, opacity);

        this.type = "text";
        this.text = text;
        this.fontsize = fontsize;
        this.justify = justify;
    }
}

canvas.addEventListener("click", () => {
    input.focus();
});

document.addEventListener("keydown", (event) => {
    input.focus();

    if (!userSet) {
        if (event.key === "Enter") {
            socket.emit("username", document.getElementById("input").value);
        }
    } else if (event.key === "Enter") {
        socket.emit("sendmessage", document.getElementById("input").value);
        document.getElementById("input").value = "";
    }
});

socket.on("recievemessage", (data) => {
    messages.push(data);
    textY += 75;
});

socket.on("register", (tf,name) => {
    if (!tf) {
        alert("invalid: " + name);
    } else {
        userSet = true;
        username = name;
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

let mouse = {
    x: 0,
    y: 0
};

let inputText = "";

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

    startMenu();

    update();
}

function startMenu() {
    const usernameInput = new Text(inputText, canvas.width / 2, canvas.height / 2, 100, 64, "center");
    uiElements.push(usernameInput)
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    inputText = document.getElementById("input").value;

    ctx.save();

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.restore();

    ctx.fillStyle = "black";
    ctx.fillRect(canvas.width / 2 - 50, 50, 100, 100);
    ctx.fillRect(0, 0, 100, 100);
    ctx.fillRect(canvas.width - 100, 0, 100, 100);
    ctx.fillRect(0, canvas.height - 100, 100, 100);
    ctx.fillRect(canvas.width - 100, canvas.height - 100, 100, 100);

    if (!userSet) {

        drawText("hello, what is your name :D", canvas.width / 2, canvas.height / 2 - 100, 64, "center");

        // drawText(inputText, canvas.width / 2, canvas.height / 2, 64, "center");
        drawTextCursor(canvas.width / 2, canvas.height / 2, 64, document.getElementById("input").value, "center");

        drawButton("play", canvas.width / 2 - 150, canvas.height / 2 + 100, 300, 100, "test");

        ctx.restore();

    } else {
        drawText("yo " + username, 60, 200, 64);
        drawText(document.getElementById("input").value, canvas.width / 2, canvas.height / 2, 64, "center");
        drawTextCursor(canvas.width / 2, canvas.height / 2, 64, document.getElementById("input").value, "center");

        if (textY < 0.1) {
            textY = 0;
        } else {
            textY = textY * 0.9;
        }

        for (let i = messages.length; i > 0; i--) {
            const message = messages[i - 1];
            const text = message.username + ": " + message.message;
            drawText(text, 60, canvas.height * 0.95 - (messages.length - i) * 75 + textY, 64);
        }
    }

    ctx.restore();
    ctx.save();

    for (const element of uiElements) {
        if (element.type === "text") {
            drawText(element.text, element.x, element.y, element.fontsize, element.justify);
        }
    }
}

init();