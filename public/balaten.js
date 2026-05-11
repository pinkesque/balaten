const socket = io();

canvas = document.getElementById('canvas');
ctx = canvas.getContext('2d');

canvas.addEventListener("contextmenu", e => {
	e.preventDefault();
});

function resize() {
	const dpr = window.devicePixelRatio || 1;
	
	canvas.width = window.innerWidth * dpr;
	canvas.height = window.innerHeight * dpr;
	
	canvas.style.width = window.innerWidth + "px",
	canvas.style.height = window.innerHeight + "px",
	
	ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

window.addEventListener("resize", resize);
resize();

function drawText(text, x, y) {
    ctx.font = '64px Arial';

    ctx.fillStyle = 'white';
    ctx.fillText(text, x, y);

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.strokeText(text, x, y);
}

canvas.addEventListener("click", () => {
    socket.emit("buttonPressed");
});

document.addEventListener("keydown", (event) => {
    socket.emit("keypress", event.code);
});

socket.on("changeText", (newText) => {
    text = newText;
});

function update() {
    render();
    requestAnimationFrame(update);
}

text = "yo";

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();

    ctx.fillStyle = 'black';
    ctx.fillRect(50, 50, 100, 100);

    ctx.restore();

    drawText(text, 60, 200);
}

update();