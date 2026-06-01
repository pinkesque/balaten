export const canvas = document.getElementById('game');
export const ctx = canvas.getContext('2d');
export let uiElements = [];

export const vars = {
    vinput: "",
    inputText: "",

    chatOpen: false,
    messages: [],

    textY: 0,
    desiredY: 0,
    textOffset: 0,

    userSet: false,
    username: "",

    serverList: []
}