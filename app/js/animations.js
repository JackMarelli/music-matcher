import { qs, qsa} from "./utils.js";

function fade(element) {
  let op = 1; // initial opacity
  let timer = setInterval(function () {
    if (op <= 0.1) {
      clearInterval(timer);
      element.style.display = "none";
    }
    element.style.opacity = op;
    element.style.filter = "alpha(opacity=" + op * 100 + ")";
    op -= op * 0.1;
  }, 50);
}

export function showTurnLoader(username) {
  const turnLoader = qs("#turnLoader");
  const turnUsername = qs("#turnUsername")
  turnUsername.innerHTML = `${username}'s`
  turnLoader.style.opacity = 1;
  turnLoader.style.display = "block";
  setTimeout(() => {
    fade(turnLoader);
  }, 1500);
}

function unfade(element) {
  let op = 0.1; // initial opacity
  element.style.display = "block";
  let timer = setInterval(function () {
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
