const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let servers = [];

const usernameRegex = /^[A-Za-z0-9_]+$/;

app.use(express.static("public")); // send client side html and js to the client on connect

io.on('connection', (socket) => {

    socket.on("buttonPressed", () => {
        // what
    })

    socket.on("keypress", (key) => {
        // why do i even need this
    });

    socket.on("disconnect", () => {
        // code
    });

    socket.on("username", (username) => {

        if (!usernameRegex.test(username)) {
            socket.emit("register", false, "invalid characters (only letters, numbers and underscore allowed)");
            return;
        } else if (username.length > 20) {
            socket.emit("register", false, "username too long (max 20 characters)");
            return;
        } else {
            console.log("user id " + socket.id + " set to " + username);
            socket.username = username;
            socket.emit("register", true, username);

            for (const message of messages) {
                socket.emit("recievemessage", {
                    username: message.username,
                    message: message.message}
                )
            }
            
        }

    });

    socket.on("sendmessage", (message) => {

        if (message.length === 0) {
            return;
        }

        let filtered = censor(message, censorlist);

        io.emit("recievemessage", {
            username: socket.username,
            message: filtered
        })

        console.log(socket.username + ": " + message);

        messages.push({username: socket.username, message: filtered})

    });

    socket.on("serversearch", () => {
        socket.emit("serverlist", servers)
    })

    socket.on("joinserver", (server) => {
        console.log(socket.username + " is trying to join server " + server)
    })

    socket.on("createserver", (server) => {
        servers.push({
            name: server.servername,
            id: servers.length,
            options: server.options
        });

        io.emit("serverlist", servers)
    })

});

server.listen(3000, () => {
    console.log('listening on *:3000');
});

let messages = [];

const censorlist = [
    "swear",
    "word",
    "you",
    "suck"
];

function censor(text, banned) {
    for (const word of banned) {
        const regex = new RegExp(word, "gi")

        text = text.replace(regex, match => "*".repeat(match.length))
    }

    return text;
}

// game state
let games = [];

const fullDeck = [
	"h1", "h2", "h3", "h4", "h5", "h6", "h7", "h8", "h9", "h10", "h11", "h12", "h13",
	"s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10", "s11", "s12", "s13",
	"d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "d10", "d11", "d12", "d13",
	"c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9", "c10", "c11", "c12", "c13"
];

const jokers = [
	{"id": 1, "name": "jimbo", "desc": "swaps hands"}
];

// shuffle it
function shuffleDeck(deck) {
	for (let i = deck.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[deck[i], deck[j]] = [deck[j], deck[i]];
	}
	return deck;
}

// draw card
function drawCard(deck) {
	return deck.pop();
}

// convert a hand array into readable string (to be replaced)
function handToString(hand) {
	return hand.map(card => `${card.suit}${card.rank}`).join(", ");
}

function init() {
	console.log(shuffleDeck(fullDeck))
	console.log(jokers)
}

init();