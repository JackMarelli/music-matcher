function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function lowercase(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}

function uniqueArray(arr){
    let a = [];
    for (let i=0, l= arr.length; i<l; i++)
        if (a.indexOf(arr[i]) === -1 && arr[i] !== '')
            a.push(arr[i]);
    return a;
}

function generateCodeVerifier(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

async function generateCodeChallenge(codeVerifier) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function qs (selector) {
	return document.querySelector(selector);
}

function qsa (selector) {
	return document.querySelectorAll(selector);
}

export { qs, qsa , capitalize, lowercase, uniqueArray, generateCodeVerifier, generateCodeChallenge};