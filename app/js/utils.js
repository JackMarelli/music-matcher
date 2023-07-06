function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function checkExpired(originalTime, currentTime, time) {
    let timeDiff = currentTime - originalTime;
    timeDiff /= 1000; 
    if (timeDiff >= time) return false;
    else return true;
}

async function generateCodeChallenge(codeVerifier) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function generateCodeVerifier(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function lowercase(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}

function qs (selector) {
	return document.querySelector(selector);
}

function qsa (selector) {
	return document.querySelectorAll(selector);
}

function uniqueArray(arr){
    let a = [];
    for (let i=0, l= arr.length; i<l; i++)
        if (a.indexOf(arr[i]) === -1 && arr[i] !== '')
            a.push(arr[i]);
    return a;
}

export { checkExpired, qs, qsa , capitalize, lowercase, uniqueArray, generateCodeVerifier, generateCodeChallenge};