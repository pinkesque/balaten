import { vars } from "./state.js"

export function hello() {
    console.log("hello from utils")
}

export function createInput() {
    vars.vinput = document.createElement("input");
    vars.vinput.id = "vinput"; 
    vars.vinput.type = "text";
    vars.vinput.style.position = "absolute";
    vars.vinput.style.left = "-9999px";
    vars.vinput.style.top = "-9999px";
    vars.vinput.value = "";
    vars.vinput.autocomplete = false;
    document.body.appendChild(vars.vinput);
    vars.vinput.focus();
}

export function resolve(value) {

    if (typeof value === "function") {
        return value();
    }

    return value;
}