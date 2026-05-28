import { canvas, ctx, vars, uiElements } from "./state.js"
import { drawText } from "./ui.js"

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

export function resizefunc() {
    window.addEventListener("resize", resize);
    resize();
}

export function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    vars.inputText = vars.vinput.value;

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

    if (vars.chatOpen) {

        let fs = 48;
        vars.desiredY = fs * vars.textOffset;

        if (vars.textY < fs * vars.textOffset) {

            vars.textY -= (vars.textY - desiredY) * 0.175;

            if (vars.textY > fs * vars.textOffset) {
                vars.textY = fs * vars.textOffset
            }

        } else if (vars.textY > fs * vars.textOffset) {

            vars.textY += (vars.desiredY - vars.textY) * 0.175;

            if (vars.textY < fs * vars.textOffset) {
                vars.textY = fs * vars.textOffset
            }
            
        }

        for (let i = vars.messages.length; i > 0; i--) {
            const message = vars.messages[i - 1];
            const text = message.username + ": " + message.message;
            drawText(text, 30, canvas.height - (vars.messages.length - i + 2) * fs + vars.textY, fs);

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

    for (let i = uiElements.length - 1; i >= 0; i--) {
        if (!uiElements[i].active) {
            uiElements.splice(i,1);
        }
    }
}