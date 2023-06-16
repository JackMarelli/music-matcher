function betterRandom (min = 0, max = 1) {
	return Math.random() * max;
}

function betterRandomInt (min = 0, max = 1) {
	return Math.round(betterRandom(min, max));
}

function qs (selector) {
	return document.querySelector(selector);
}

function qsa (selector) {
	return document.querySelectorAll(selector);
}

export { betterRandom, betterRandomInt, qs, qsa };