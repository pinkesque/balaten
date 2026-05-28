import * as network from "./network.js"
import * as render from "./render.js"
import * as utils from "./utils.js"
import * as input from "./input.js"
import * as ui from "./ui.js"
import * as menus from "./menus.js"
import * as state from "./state.js"

utils.hello();

function init() {
    render.resizefunc();
    utils.createInput();
    input.initInput();
    menus.startMenu();  

    update();
}

function update() {
    render.render();
    requestAnimationFrame(update);
}

init();