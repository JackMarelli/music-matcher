import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { io } from "socket.io-client";

document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Hello Vite!</h1>
    <div class="card">
      <button id="testHelloBtn" type="button">Test</button>
    </div>
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>
  </div>
`

const _app = {}
_app.testHelloBtn = document.querySelector("#testHelloBtn");

_app.testHello = () => {
  socket.emit("hello", "testUsername");
}

const socket = io("http://localhost:3000");

socket.on("hello", (message) => {
  console.log(message);
})

_app.startUp = () => {
  _app.testHelloBtn.addEventListener("click", () => {
    console.log("btn pressed");
    _app.testHello();
  });
};

_app.startUp();