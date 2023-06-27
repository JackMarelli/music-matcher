function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function uniqueArray(arr){
    let a = [];
    for (let i=0, l= arr.length; i<l; i++)
        if (a.indexOf(arr[i]) === -1 && arr[i] !== '')
            a.push(arr[i]);
    return a;
}

function betterRandom (min = 0, max = 1) {
	return Math.random() * max;
}

function qs (selector) {
	return document.querySelector(selector);
}

function qsa (selector) {
	return document.querySelectorAll(selector);
}


export { qs, qsa , capitalize, uniqueArray};