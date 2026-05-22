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
	
	canvas.style.width = window.innerWidth + "px";
	canvas.style.height = window.innerHeight + "px";
	
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
    ctx.lineWidth = fontsize / 8;

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

function drawButton(x, y, width, height, func, justify) {
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 8;

    if (justify === "center") {
        x -= width / 2;
    }

    if (justify === "right") {
        x -= width;
    }

    ctx.fillRect(x, y, width, height);
    ctx.strokeRect(x, y, width, height);
}

function resolve(value) {

    if (typeof value === "function") {
        return value();
    }

    return value;
}

function removeUI(name) {

    const index = uiElements.findIndex(
        e => e.name === name
    );

    if (index !== -1) {
        uiElements[index].active = false;
    }
}

let uiElements = [];

class UIElement {

    constructor(
        name, 
        pos = {}, 
        size = {},
        composite = {}
    ) {

        this.name = name;

        this.x = pos.x ?? 0;
        this.y = pos.y ?? 0;
        this.angle = pos.angle ?? 0;
        this.justify = pos.justify ?? "left";

        this.prevX = this.x;
        this.prevY = this.y;
        this.prevAngle = pos.angle ?? 0;

        this.size = size.size ?? false;
        this.width = size.width ?? 0;
        this.height = size.height ?? 0;

        this.opacity = composite.opacity ?? 1;
        this.active = true;

    }

    contains(x, y) {

        let rx = resolve(this.x);
        let ry = resolve(this.y);

        let rw = resolve(this.width);
        let rh = resolve(this.height);

        if (this.justify === "center") {
            rx -= rw / 2;
        }

        if (this.justify === "right") {
            rx -= rw;
        }

        return(
            x > rx && 
            x < rx + rw &&
            y > ry &&
            y < ry + rh
        );

    }
}

class Text extends UIElement {

    constructor(
        name, 
        text = {}, 
        pos = {},
        composite = {}
    ) {

        super(name, pos, composite);

        this.type = "text";
        this.text = text.text;
        this.fontsize = text.fontsize;

    }

    draw() {

        drawText(resolve(this.text), resolve(this.x), resolve(this.y), resolve(this.fontsize), this.justify);

    }

}

class TextField extends Text {

    constructor(
        name, 
        text = {}, 
        pos = {}, 
        composite = {}
    ) {

        super(name, text, pos, composite);

        this.selectionPos = text.selectionPos;

    }

    draw() {

        super.draw();

        drawTextCursor(resolve(this.text), resolve(this.x), resolve(this.y), resolve(this.fontsize), this.justify, resolve(this.selectionPos));

    }

}

class Button extends UIElement {

    constructor(
        name, 
        pos = {}, 
        size = {}, 
        text = {},
        composite = {}, 
        func
    ) {

        super(name, pos, size, composite);

        this.type = "button";
        this.func = func;

        this.text = text.text;
        this.fontsize = text.fontsize;

        this.textx = () => resolve(this.x);
        this.texty = () => resolve(this.y) + resolve(this.fontsize) + 5;
        this.textjustify = text.justify ?? this.justify;

        console.log(this.textx)

    }

    draw() {

        drawButton(resolve(this.x), resolve(this.y), resolve(this.width), resolve(this.height), this.func, this.justify);

        let nx = resolve(this.textx);

        if (this.justify === "left") {
            nx += resolve(this.width) / 2;
        } else if (this.justify === "right") {
            nx -= resolve(this.width) / 2;
        }

        drawText(resolve(this.text), nx, resolve(this.texty), resolve(this.fontsize), this.textjustify);

    }

    onClick() {

        this.func();

    }

}

canvas.addEventListener("mousemove", () => {
    mouse = {
        x: event.x,
        y: event.y
    }
});

canvas.addEventListener("mousedown", () => {
    vinput.focus();

    for (const element of uiElements) {
        if (element.type === "button" && element.contains(mouse.x, mouse.y)) {
            element.onClick();
        }
    }   
});

document.addEventListener("keydown", (event) => {
    vinput.focus();

    if (!userSet) {
        if (event.key === "Enter") {
            socket.emit("username", document.getElementById("vinput").value);
        }
    } else if (event.key === "Enter") {
        socket.emit("sendmessage", document.getElementById("vinput").value);
        document.getElementById("vinput").value = "";
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

socket.on("recievemessage", (data) => {
    messages.push(data);
    textY += 50;
});

socket.on("register", (tf,name) => {
    if (!tf) {
        alert("invalid: " + name);
    } else {
        userSet = true;
        username = name;
        document.getElementById("vinput").value = "";
        mainMenu();
    }
});

function update() {
    render();
    requestAnimationFrame(update);
}

var text = "yo";

var userSet = false;
var username = "";

let vinput;

let messages = [];

let textY = 0;
let textOffset = 0;

let mouse = {
    x: 0,
    y: 0
};

let chatOpen = false;

let inputText = "";
let inputPos;

function init() {
    vinput = document.createElement("input");
    vinput.id = "vinput"; 
    vinput.type = "text";
    vinput.style.position = "absolute";
    vinput.style.left = "-9999px";
    vinput.style.top = "-9999px";
    vinput.value = "";
    vinput.autocomplete = false;
    document.body.appendChild(vinput);
    vinput.focus();

    startMenu();

    update();
}

function startMenu() {

    const usernameInput = new TextField(
        "usernameInput",

        {
            text: () => inputText,
            fontsize: 64,
            selectionPos: () => vinput.selectionStart
        },

        {
            x: () => canvas.width / 2, 
            y: () => canvas.height / 2,
            justify: "center"
        },

        {
            opacity: 1
        }
    )

    const hello = new Text(

        "hello",

        {
            text: "hello what is your name :3",
            fontsize: 64,
            selectionPos: () => vinput.selectionStart
        },

        {
            x: () => canvas.width / 2, 
            y: () => canvas.height / 2 - 100,
            justify: "center"
        },

        {
            opacity: 1
        }
    )

    const usernameButton = new Button(

        "usernameButton",

        {
            x: () => canvas.width / 2, 
            y: () => canvas.height / 2 + 100,
            justify: "center"
        },

        {
            width: 250,
            height: 100
        },

        {
            text: "hello",
            fontsize: 64,
            justify: "center"
        },

        {
            opacity: 1
        },

        () => socket.emit("username", document.getElementById("vinput").value)
    )

    uiElements.push(usernameInput, hello, usernameButton)
}

function mainMenu() {
    console.log("main menu called")

    uiElements.length = 0;

    const playButton = new Button(

        "playButton",

        {
            x: () => canvas.width / 2,
            y: () => canvas.height / 2 + 100,
            justify: "center"

        },

        {
            width: 250,
            height: 100
        },

        {
            text: "play",
            fontsize: 64,
            justify: "center"
        },

        {
            opacity: 1
        },

        () => playMenu()
    )

    const chatButton = new Button(

        "chatButton",

        {
            x: 100,
            y: () => canvas.height / 2 + 100,
            justify: "left"
        },

        {
            width: 250,
            height: 100
        },

        {
            text: "chat",
            fontsize: 64,
            justify: "center"
        },

        {
            opacity: 1
        },

        () => chatMenu()
    )

    const fuckyoubutton = new Button(

        "fuckyoubutton",

        {
            x: () => canvas.width - 100,
            y: () => canvas.height / 2 + 100,
            justify: "right"
        },

        {
            width: 250,
            height: 100
        },

        {
            text: "fuck you",
            fontsize: 64,
            justify: "center"
        },

        {
            opacity: 1
        },

        () => console.log("fuck you")
    )

    uiElements.push(chatButton, playButton, fuckyoubutton)
}

function chatMenu() {
    
    const textInput = new TextField(

        "textInput",

        {
            text: () => inputText,
            fontsize: 48,
            selectionPos: () => vinput.selectionStart
        },

        {
            x: 30,
            y: () => canvas.height - 30,
            justify: "left"
        },

        {
            opacity: 1
        }
    );

    chatOpen = true;

    uiElements.push(textInput)
}

function playMenu() {

    const playTitle = new Text(

        "playTitle",

        {
            text: "hi you're playing i think",
            fontsize: 64
        },

        {
            x: () => canvas.width / 2,
            y: 100,
            justify: "center"
        },
        
        {
            opacity: 1
        }
    )

    uiElements.push(playTitle)
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    inputText = document.getElementById("vinput").value;

    ctx.save();

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.restore();

    if (false) {
        ctx.fillStyle = "black";
        ctx.fillRect(canvas.width / 2 - 50, 50, 100, 100);
        ctx.fillRect(0, 0, 100, 100);
        ctx.fillRect(canvas.width - 100, 0, 100, 100);
        ctx.fillRect(0, canvas.height - 100, 100, 100);
        ctx.fillRect(canvas.width - 100, canvas.height - 100, 100, 100);
    }

    if (chatOpen) {

        let fs = 48;
        desiredY = fs * textOffset;

        if (textY < fs * textOffset) {

            textY -= (textY - desiredY) * 0.175;

            if (textY > fs * textOffset) {
                textY = fs * textOffset
            }

        } else if (textY > fs * textOffset) {

            textY += (desiredY - textY) * 0.175;

            if (textY < fs * textOffset) {
                textY = fs * textOffset
            }
            
        }

        console.log(textY)

        for (let i = messages.length; i > 0; i--) {
            const message = messages[i - 1];
            const text = message.username + ": " + message.message;
            drawText(text, 30, canvas.height - (messages.length - i + 2) * fs + textY, fs);

        }
    }

    ctx.restore();
    ctx.save();

    for (const element of uiElements) {
        if (element.opacity > 0) {
            ctx.globalAlpha = element.opacity

            element.draw();
        }
    }

    uiElements = uiElements.filter(
        e => e.active
    );
}

init();