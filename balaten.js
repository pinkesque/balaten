// would you fucking believe it i might get started on coding the game soon

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