import { UIElement, Text, TextField, Button, List } from "./ui.js"
import { vars, canvas, ctx, uiElements } from "./state.js"
import { socket, serverSearch } from "./network.js"

export function startMenu() {

    const usernameInput = new TextField(
        {
            name: "usernameInput",

            text: {
                text: () => vars.inputText,
                fontsize: 64,
                selectionPos: () => vars.vinput.selectionStart
            },

            pos: {
                x: () => canvas.width / 2, 
                y: () => canvas.height / 2,
                justify: "center"
            },

            composite: {
                opacity: 1
            }
        }
    )

    const hello = new Text(
        {
            name: "hello",

            text: {
                text: "hello what is your name :3",
                fontsize: 64,
                selectionPos: () => vars.vinput.selectionStart
            },

            pos: {
                x: () => canvas.width / 2, 
                y: () => canvas.height / 2 - 100,
                justify: "center"
            },

            composite: {
                opacity: 1
            }
        }
    )

    const usernameButton = new Button(
        {
            name: "usernameButton",

            pos: {
                x: () => canvas.width / 2, 
                y: () => canvas.height / 2 + 100,
                justify: "center"
            },

            size: {
                width: 250,
                height: 100
            },

            text: {
                text: "hello",
                fontsize: 64,
                justify: "center"
            },

            composite: {
                opacity: 1
            },

            func: () => socket.emit("username", vars.vinput.value)
        }
    )

    uiElements.push(usernameInput, hello, usernameButton)
}

export function mainMenu() {
    console.log("main menu called")

    uiElements.length = 0;

    const playButton = new Button(
        {
            name: "playButton",

            pos: {
                x: () => canvas.width / 2,
                y: () => canvas.height / 2 + 100,
                justify: "center"
            },

            size: {
                width: 250,
                height: 100
            },

            text: {
                text: "play",
                fontsize: 64,
                justify: "center"
            },

            composite: {
                opacity: 1
            },

            func: () => playMenu()
        }
    )

    const chatButton = new Button(
        {
            name: "chatButton",

            pos: {
                x: 100,
                y: () => canvas.height / 2 + 100,
                justify: "left"
            },

            size: {
                width: 250,
                height: 100
            },

            text: {
                text: "chat",
                fontsize: 64,
                justify: "center"
            },

            composite: {
                opacity: 1
            },

            func: () => chatMenu()
        }
    )

    const fuckyoubutton = new Button(
        {
            name: "fuckyoubutton",

            pos: {
                x: () => canvas.width - 100,
                y: () => canvas.height / 2 + 100,
                justify: "right"
            },

            size: {
                width: 250,
                height: 100
            },

            text: {
                text: "fuck you",
                fontsize: 64,
                justify: "center"
            },

            composite: {
                opacity: 1
            },

            func: () => console.log("fuck you")
        }
    )

    uiElements.push(chatButton, playButton, fuckyoubutton)
}

export function chatMenu() {

    uiElements.length = 0;
    
    const textInput = new TextField(
        {
            name: "textInput",

            text: {
                text: () => vars.inputText,
                fontsize: 48,
                selectionPos: () => vars.vinput.selectionStart
            },

            pos: {
                x: 30,
                y: () => canvas.height - 30,
                justify: "left"
            },

            composite: {
                opacity: 1
            }
        }
    );

    const backbutton = new Button(
        {
            name: "backbutton",

            pos: {
                x: 25,
                y: 25,
                justify: "left"
            },

            size: {
                width: 200,
                height: 75
            },

            text: {
                text: "↩ back",
                fontsize: 48,
                justify: "center"
            },

            composite: {
                opacity: 1
            },

            func: () => {
                mainMenu() 
                vars.chatOpen = false
            }
        }
    )

    vars.chatOpen = true;

    uiElements.push(textInput, backbutton)
}

export function playMenu() {

    uiElements.length = 0;
    serverSearch();

    const playTitle = new Text(
        {
            name: "playTitle",

            text: {
                text: "hi you're playing i think",
                fontsize: 64
            },

            pos: {
                x: () => canvas.width / 2,
                y: 100,
                justify: "center"
            },
            
            composite: {
                opacity: 1
            }
        }
    )

    const backbutton = new Button(
        {
            name: "backbutton",

            pos: {
                x: 25,
                y: 25,
                justify: "left"
            },

            size: {
                width: 200,
                height: 75
            },

            text: {
                text: "↩ back",
                fontsize: 48,
                justify: "center"
            },

            composite: {
                opacity: 1
            },

            func: () => {
                mainMenu()
            }
        }
    )

    const serverList = new List(
        {
            name: "serverList",

            pos: {
                x: () => canvas.width / 3,
                y: () => canvas.height / 3,
                justify: "center"
            },

            size: {
                width: () => canvas.width / 3,
                height: () => canvas.height / 3
            },

            composite: {
                opacity: 1
            },

            layout: {
                direction: "vertical",
                spacing: 10
            },

            template: (server) => 
                new Button(
                    {
                        name: server.id,

                        text: {
                            text: server.name,
                            fontsize: 32,
                            justify: "center"
                        },

                        size: {
                            width: 300,
                            height: 75
                        },

                        func: () => joinServer(server.id)
                    }
                ),
        }
    )

    uiElements.push(playTitle, serverList, backbutton)
}