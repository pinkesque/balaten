import { UIElement, Text, TextField, Button } from "./ui.js"
import { vars, canvas, ctx, uiElements } from "./state.js"
import { socket } from "./network.js"

export function startMenu() {

    const usernameInput = new TextField(
        "usernameInput",

        {
            text: () => vars.inputText,
            fontsize: 64,
            selectionPos: () => vars.vinput.selectionStart
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
            selectionPos: () => vars.vinput.selectionStart
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

        () => socket.emit("username", vars.vinput.value)
    )

    uiElements.push(usernameInput, hello, usernameButton)
}

export function mainMenu() {
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

export function chatMenu() {
    
    const textInput = new TextField(

        "textInput",

        {
            text: () => vars.inputText,
            fontsize: 48,
            selectionPos: () => vars.vinput.selectionStart
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

    vars.chatOpen = true;

    uiElements.push(textInput)
}

export function playMenu() {

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