import { qs, qsa} from "./utils.js";

export function showTurnLoader(username) {
  console.log("turn loader");
  const turnLoader = qs("#turnLoader");
  const turnUsername = qs("#turnUsername")
  turnUsername.innerHTML = `${username}'s`
  turnLoader.style.opacity = 1;
  turnLoader.style.display = "block";
  setTimeout(() => {
    fade(turnLoader);
  }, 1500);
}

function fade(element) {
  var op = 1; // initial opacity
  var timer = setInterval(function () {
    if (op <= 0.1) {
      clearInterval(timer);
      element.style.display = "none";
    }
    element.style.opacity = op;
    element.style.filter = "alpha(opacity=" + op * 100 + ")";
    op -= op * 0.1;
  }, 50);
}

function unfade(element) {
  var op = 0.1; // initial opacity
  element.style.display = "block";
  var timer = setInterval(function () {
    if (op >= 1) {
      clearInterval(timer);
    }
    element.style.opacity = op;
    element.style.filter = "alpha(opacity=" + op * 100 + ")";
    op += op * 0.1;
  }, 10);
}


export function waitingDots() {
  let dots = window.setInterval( function() {
    let wait = qs(".waiting");
    if (!wait) {
      clearInterval(dots);
      return;
    }
    if ( wait.innerHTML.length > 9 ) 
        wait.innerHTML = "waiting";
    else 
        wait.innerHTML += ".";
    }, 200);
}
