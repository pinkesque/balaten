export let messages = [];

const censorlist = [
    "swear",
    "word",
    "you",
    "suck"
];

export function censor(text, banned) {
    for (const word of banned) {
        const regex = new RegExp(word, "gi")

        text = text.replace(regex, match => "*".repeat(match.length))
    }

    return text;
}

export function sendMessage(message) {
    if (message.length === 0) {
        return;
    }

    let filtered = censor(message, censorlist);

    // io.emit("recievemessage", {
    //     username: socket.username,
    //     message: filtered
    // })

    return(filtered)
}