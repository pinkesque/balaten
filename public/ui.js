import { ctx, canvas, uiElements } from "./state.js"
import { resolve } from "./utils.js"

export function drawText(text, x, y, fontsize, justify) {
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

export function drawTextCursor(text, x, y, fontsize, justify, pos) {
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

export function drawButton(x, y, width, height, func, justify) {
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

export function removeUI(name) {

    const index = uiElements.findIndex(
        e => e.name === name
    );

    if (index !== -1) {
        uiElements[index].active = false;
    }
}

export function findUI(name) {
    return uiElements.find(e => e.name === name);
}

export class UIElement {

    constructor(
        options = {}
    ) {

        this.name = options.name;

        this.x = options.pos?.x ?? 0;
        this.y = options.pos?.y ?? 0;
        this.angle = options.pos?.angle ?? 0;
        this.justify = options.pos?.justify ?? "left";

        // this.prevX = () => this.x;
        // this.prevY = () => this.y;
        // this.prevAngle = options.pos?.angle ?? 0;

        this.size = options.size?.size ?? 1;
        this.width = options.size?.width ?? 0;
        this.height = options.size?.height ?? 0;

        this.opacity = options.composite?.opacity ?? 1;
        this.active = true;

        this.children = options.children ?? [];
        this.parent = null;

    }

    getGlobalX() {
        let x = resolve(this.x);

        if (this.parent) {
            x += this.parent.getGlobalX();
        };

        return x;
    }

    getGlobalY() {
        let y = resolve(this.y);

        if (this.parent) {
            y += this.parent.getGlobalY();
        }

        return y;
    }

    addChild(child) {
        child.parent = this;
        this.children.push(child)
    }
    
    removeChild(child) {
        const index = this.children.indexOf(child)

        if (index !== -1) {
            child.parent = null;
            this.children.splice(index, 1)
        }
    }

    contains(x, y) {

        let rx = this.getGlobalX();
        let ry = this.getGlobalY();

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

    render() {

        if (this.opacity === 0) return;

        this.draw()

        for (const child of this.children) {
            if (child.opacity === 0) return;
            child.render()
        }
    }

    draw() {}

}

export class Text extends UIElement {

    constructor(
        options = {}
    ) {

        super(options);

        this.type = "text";
        this.text = options.text?.text;
        this.fontsize = options.text?.fontsize;

    }

    draw() {

        drawText(resolve(this.text), this.getGlobalX(), this.getGlobalY(), resolve(this.fontsize), this.justify);

    }

}

export class TextField extends Text {

    constructor(
        options = {}
    ) {

        super(options);

        this.type = "textField";

        this.selectionPos = options.text?.selectionPos;

    }

    draw() {

        super.draw();

        drawTextCursor(resolve(this.text), this.getGlobalX(), this.getGlobalY(), resolve(this.fontsize), this.justify, resolve(this.selectionPos));

    }

}

export class Button extends UIElement {

    constructor(
        options = {}
    ) {

        super(options);

        this.type = "button";

        this.func = options.func;

        this.text = options.text?.text;
        this.fontsize = options.text?.fontsize;

        this.textx = () => this.getGlobalX();
        this.texty = () => this.getGlobalY() + resolve(this.fontsize) + 5;
        this.textjustify = options.text?.justify ?? this.justify;

    }

    draw() {

        drawButton(this.getGlobalX(), this.getGlobalY(), resolve(this.width), resolve(this.height), this.func, this.justify);

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

export class List extends UIElement {
    constructor(
        options = {}
    ) {

        super(options)

        this.type = "list"

        this.layout = options.layout?.direction ?? "vertical"
        this.spacing = options.layout?.spacing ?? 50
        this._data = options.data ?? []

        this.template = options.template

        this.rebuild()
    }

    get data() {
        return this._data
    }

    set data(value) {
        this._data = value
        this.rebuild()
    }

    rebuild() {
        this.children = [];

        for (const [index, item] of this.data.entries()) {
            const child = this.template(item, index)

            child.y = index * (resolve(child.height) + resolve(this.spacing))

            this.addChild(child);
        }
    }

    add(item) {
        this._data.push(item)
        this.rebuild()
    }

    remove(item) {
        this._data = this._data.filer(
            item => item.id !== id
        )
        this.rebuild()
    }

    draw() {}
}