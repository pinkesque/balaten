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

function drawTextCursor(text, x, y, fontsize, justify, pos) {
    if (Math.floor(performance.now() / 500) % 2 === 0) {
        const beforeCursor = text.substring(0, pos);
        ctx.font = fontsize + 'px funny';

        const beforeWidth = ctx.measureText(beforeCursor).width;

        if (justify === "center") {
            x -= ctx.measureText(text).width / 2;
        }

        if (justify === "right") {
            x -= ctx.measureText(text).width;
        }

        ctx.fillStyle = "black";
        ctx.fillRect(x + beforeWidth - 2, y - fontsize + 8, 4, fontsize);
    }
}

function drawButton(x, y, width, height, func) {
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 8;

    ctx.fillRect(x, y, width, height);
    ctx.strokeRect(x, y, width, height);
}

function resolve(value) {

    if (typeof value === "function") {
        return value();
    }

    return value;
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

    draw() {

        drawButton(this.x, this.y, this.width, this.height, this.func);

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

    draw() {

        drawText(resolve(this.text), this.x, this.y, this.fontsize, this.justify);

    }

}

class TextField extends Text {

    constructor(text, x, y, opacity, fontsize, justify, selectionPos) {

        super(text, x, y, opacity, fontsize, justify);

        this.selectionPos = selectionPos;

    }

    draw() {

        super.draw();

        drawTextCursor(resolve(this.text), this.x, this.y, this.fontsize, this.justify, resolve(this.selectionPos));

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
let inputPos;

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

    const usernameInput = new TextField(
        () => inputText, 
        canvas.width / 2, 
        canvas.height / 2, 
        100, 
        64, 
        "center",
        () => input.selectionStart);

    const test = new Text(
        "test", 
        50, 
        canvas.height / 2, 
        100, 
        64, 
        "left");

    uiElements.push(usernameInput, test)
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

        drawText("hello, what is your name :3", canvas.width / 2, canvas.height / 2 - 100, 64, "center");

        drawButton(canvas.width / 2 - 150, canvas.height / 2 + 100, 300, 100, "test");

    } else {

        drawText("yo " + username, 60, 200, 64);

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
        element.draw();
    }
}

init();