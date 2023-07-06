import { checkExpired, qs, qsa, capitalize, uniqueArray } from "./utils.js";
import SpotifyDataManager from "./classes/SpotifyDataManager.js";
import Host from "./classes/Host.js";

const _app = {};
_app.startUp = () => {
  // ad ogni page e referesh
  _app.sdm = new SpotifyDataManager();
  _app.host = null;
  _app.usersnames = null;
  _app.users = [];
  _app.initSpotifyData();
  _app.quizPhaseCounter = 0;

  //nella pagina di Login
  if (document.location.pathname.includes("spotifylogin.html")) {
    document
      .querySelector(".buttonToken")
      .addEventListener("click", _app.requestSpotifyAuth);
    _app.inputLogin = document.querySelector("#username");
  }
};

//Funzioni che gestiscono i diversi users
_app.createUser = () => {
  if (_app.userNumber == 5) {
    return;
  } else if (_app.userNumber == 4) _app.addUserButton.className += " d-none";

  let userDiv = document.createElement("div");
  userDiv.className =
    "w-100 d-flex justify-content-start align-items-center text-input mb-2 user";

  let userImg = document.createElement("img");
  userImg.src = "../assets/images/svg/user.svg";

  let deleteButton = document.createElement("button");
  let removeImg = document.createElement("img");
  removeImg.src = "../assets/images/svg/remove.svg";

  let inputUser = document.createElement("input");
  //inputUser.id =  _app.userNumber.toString();
  inputUser.type = "text";
  inputUser.className = "w-100 h-100 userText";
  inputUser.placeholder = "Insert username";

  _app.usersContainer.insertBefore(
    userDiv,
    _app.usersContainer.childNodes[_app.usersContainer.childElementCount]
  );
  userDiv.appendChild(userImg);
  userDiv.appendChild(inputUser);

  userDiv.appendChild(deleteButton);
  deleteButton.appendChild(removeImg);
  deleteButton.addEventListener("click", function (e) {
    if (e.target !== this) _app.removeUser(e.target);
  });

  _app.userNumber++;

  /*<div class="w-100 d-flex justify-content-start align-items-center text-input mb-2">
                                <img src="../assets/images/svg/user.svg" alt="">
                                <input class="w-100 h-100" type="text" name="" id="" placeholder="Insert username">
                                <button><img src="../assets/images/svg/remove.svg" alt=""></button>
    </div>*/
};
_app.removeUser = (e) => {
  if (_app.userNumber == 5)
    _app.addUserButton.className = _app.addUserButton.className.slice(0, -7);
  e.parentElement.parentElement.remove();
  _app.userNumber--;
};
_app.getAndSaveUsername = () => {
  if (localStorage.host) {
    let usernameArray = [];
    let incomplete = false;
    const usersArray = document.querySelectorAll(".userText");
    usersArray.forEach((user) => {
      if (user.value === "") {
        incomplete = true;
      } else {
        usernameArray.push(user.value);
      }
    });

    if (!incomplete) {
      localStorage.usersnames = JSON.stringify(usernameArray);
      _app.startQuiz(usernameArray);
    }
  }
};
_app.startQuiz = () => {
  //console.log(usernames);
  localStorage.removeItem("verifier"); // non so se servirà in fututo
  document.location = "/app/pages/questions.html";
};
_app.setupUsers = (hostUsername = "") => {
  //nella pagina di SetUp
  if (document.location.pathname.includes("setup.html")) {
    document
      .querySelector(".log-out")
      .addEventListener("click", _app.clearLocalStorage);
    document.querySelector("#d").value = hostUsername;
    const startQuizButton = document.querySelector(".start-quiz");

    _app.usersContainer = document.querySelector(".input-box-wrapper");
    _app.addUserButton = document.querySelector(".add-button");
    _app.userNumber = 1;

    _app.addUserButton.addEventListener("click", _app.createUser);
    startQuizButton.addEventListener("click", _app.getAndSaveUsername);
  }
};

//Funzioni che creano e gestiscono i quiz
_app.initializeQuiz = (host) => {
  _app.userIndex = 0;

  qs(".active-username").innerHTML = _app.usersnames[0];
  _app.quizOptions1 = [ "english", "italian", "spanish", "german", "greek", "norwegian", "russian", "mandarin", "romanian", "french", "danish", "korean", "japanese", "portuguese"];
  _app.quizOptions2x = [ "acoustic", "afrobeat", "alt-rock", "alternative", "ambient", "anime", "black-metal", "bluegrass", "blues", "bossanova", "brazil", "breakbeat", "british", "cantopop", "chicago-house", "children", "chill", "classical", "club", "comedy", "country", "dance", "dancehall", "death-metal", "deep-house", "detroit-techno", "disco", "disney", "drum-and-bass", "dub", "dubstep", "edm", "electro", "electronic", "emo", "folk", "forro", "french", "funk", "garage", "german", "gospel", "goth", "grindcore", "groove", "grunge", "guitar", "happy", "hard-rock", "hardcore", "hardstyle", "heavy-metal", "hip-hop", "holidays", "honky-tonk", "house", "idm", "indian", "indie", "indie-pop", "industrial", "iranian", "j-dance", "j-idol", "j-pop", "j-rock", "jazz", "k-pop", "kids", "latin", "latino", "malay", "mandopop", "metal", "metal-misc", "metalcore", "minimal-techno", "movies", "mpb", "new-age", "new-release", "opera", "pagode", "party", "philippines-opm", "piano", "pop", "pop-film", "post-dubstep", "power-pop", "progressive-house", "psych-rock", "punk", "punk-rock", "r-n-b", "rainy-day", "reggae", "reggaeton", "road-trip", "rock", "rock-n-roll", "rockabilly", "romance", "sad", "salsa", "samba", "sertanejo", "show-tunes", "singer-songwriter", "ska", "sleep", "songwriter", "soul", "soundtracks", "spanish", "study", "summer", "swedish", "synth-pop", "tango", "techno", "trance", "trip-hop", "turkish", "work-out", "world-music",];
  _app.quizOptions2 = [ "acoustic", "afrobeat", "alternative", "black-metal", "blues", "bossanova", "children", "chill", "classical", "country", "dance", "dancehall", "death-metal", "disco", "disney", "drum-and-bass", "dubstep", "edm", "electro", "electronic", "emo", "folk", "funk", "garage", "german", "gospel", "goth", "groove", "grunge", "guitar", "hard-rock", "hardcore", "hardstyle", "heavy-metal", "hip-hop", "holidays", "honky-tonk", "house", "idm", "indian", "indie", "indie-pop", "industrial", "iranian", "j-dance", "j-idol", "j-pop", "j-rock", "jazz", "k-pop", "kids", "latin", "latino", "metal", "minimal-techno", "mpb", "opera", "party", "piano", "pop", "post-dubstep", "power-pop", "progressive-house", "psych-rock", "punk", "punk-rock", "r-n-b", "reggae", "reggaeton", "rock", "rock-n-roll", "rockabilly", "romance", "sad", "salsa", "samba", "show-tunes", "singer-songwriter", "sleep", "songwriter", "soul", "soundtracks", "study", "summer", "synth-pop", "tango", "techno", "work-out",];

  qs(".submit").addEventListener("click", _app.registerQuizResponse);
  _app.createQuiz(_app.quizOptions1);
};

_app.createQuiz = (options) => {
  _app.quizContainer = qs(".input-box-wrapper");
  for (let option of options) {
    let quizDiv = document.createElement("div");
    quizDiv.className = "box";
    
    let inputQuiz = document.createElement("input");
    inputQuiz.type =  "checkbox";
    inputQuiz.className =  "checkbox";
    inputQuiz.id = `${option}`;
    inputQuiz.value = `${option}`;

    let labelQuiz = document.createElement("label");
    labelQuiz.htmlFor = `${option}`;
    labelQuiz.innerHTML = `${capitalize(option)}`;

    quizDiv.appendChild(inputQuiz);
    quizDiv.appendChild(labelQuiz);
    inputQuiz.addEventListener("click", _app.selectionLimitQuiz(1));

    _app.quizContainer.appendChild(quizDiv);
  }
};

_app.slideQuizSlider = () => {
  _app.slider = qs("#questions-slider");
  _app.questionsEls = qsa(".question");
  console.log(_app.questionsEls);
};

_app.handleQuiz = (result) => {
  _app.quizPhaseCounter++;
  _app.quizContainer.innerHTML = "";
  if (_app.quizPhaseCounter == 0) {
  } else if (_app.quizPhaseCounter == 1) {
    _app.createQuiz(_app.quizOptions2);
    _app.quizResponse1 = result;
    _app.slideQuizSlider();
  } else if (_app.quizPhaseCounter == 2) {
    _app.quizResponse2 = result;
    //console.log("FASE 2")
    _app.requestArtist(_app.quizResponse2, _app.quizResponse1);
  } else if (_app.quizPhaseCounter == 3) {
    //console.log("FASE 3")
    _app.quizResponse3 = result;
    const obj = {
      username: _app.usersnames[_app.userIndex],
      r1: _app.quizResponse1,
      r2: _app.quizResponse2,
      r3: _app.quizResponse3,
    };
    _app.users.push(obj);
    //console.log("salvare user e passare al prossimo");
    _app.userIndex++;
    _app.quizPhaseCounter = 0;

    if (!_app.usersnames[_app.userIndex]) {
      localStorage.setItem("users", JSON.stringify(_app.users));
      _app.quizContainer.innerHTML = "";
      //console.log("FINE QUIZ");
      document.location = "/app/pages/result.html";
    } else {
      qs(".active-username").innerHTML = _app.usersnames[_app.userIndex];
      _app.createQuiz(_app.quizOptions1);
    }
  }
};

_app.registerQuizResponse = () => {
  let checkboxes = document.querySelectorAll(".checkbox");
  let resultsArray = [];
  for (let checkbox of checkboxes) {
    if (checkbox.checked == true) resultsArray.push(checkbox.value);
    else resultsArray = resultsArray.filter((e) => e !== checkbox.value);
  }
  //console.log(resultsArray);
  if (resultsArray.length > 0) {
    _app.handleQuiz(resultsArray);
  }
};

_app.selectionLimitQuiz = (n) => {
  let checks= document.querySelectorAll(".checkbox");
  let max = 2;
  for (let i = 0; i < checks.length; i++) checks[i].onclick = selectiveCheck;
  function selectiveCheck () {
    let checkedChecks = document.querySelectorAll(".checkbox:checked");
    if (checkedChecks.length >= n + 1) return false;
  }
};

//Funzioni principali e generali
_app.detectPhase = () => {
  if (
    document.location.pathname.includes("pages") &&
    !localStorage.host &&
    !document.location.pathname.includes("spotifylogin")
  ) {
    document.location = "/app/pages/spotifylogin.html";
  }
  if (
    document.location.pathname.includes("spotifylogin.html") &&
    localStorage.host
  ) {
    document.location = "/app/pages/setup.html";
  }
  if (document.location.pathname.includes("setup.html") && _app.host) {
    _app.setupUsers(_app.host.username);
  }
  if (document.location.pathname.includes("questions.html") && _app.host) {
    _app.initializeQuiz(_app.host);
  }
  if (document.location.pathname.includes("result.html")) {
    if (localStorage.users) _app.initializePlaylist();
    else document.location = "/app/pages/spotifylogin.html";
  }
  if (document.location.pathname.includes("end.html")) {
    if (localStorage.playlist) {
      qs(".redirect-playlist").addEventListener("click", function () {
        window.open(
          `https://open.spotify.com/playlist/${_app.playlistID}`,
          "_blank"
        ) ||
          window.location.replace(
            `https://open.spotify.com/playlist/${_app.playlistID}`
          );
      });
    } else document.location = "/app/pages/login.html";
  }
};
_app.requestSpotifyAuth = () => {
  if (!localStorage.host) _app.sdm.initAuthentication();
};
_app.initSpotifyData = () => {
  if (localStorage.host) {
    _app.loadLocalStorage();
    _app.displayUser(); // per mostrare icona spotify da riposizionare
  } else {
    _app.sdm.loadSpotifyHostData().then((profile) => {
      if (profile) {
        _app.host = new Host(
          profile.id,
          profile.display_name,
          profile.images[0].url,
          profile.token,
          profile.timeTokenCreation
        );
        _app.saveLocalData();
        _app.displayUser(); // per mostrare icona spotify da riposizionare
      }
      _app.detectPhase();
    });
  }
};
_app.displayUser = () => {
  if (_app.host.img && document.location.pathname.includes("setup.html")) {
    const profileImage = new Image(50, 50);
    profileImage.src = _app.host.img;
    document.getElementById("avatar").appendChild(profileImage);
  }
};
_app.clearLocalStorage = () => {
  localStorage.clear();
  document.location = "/app/pages/spotifylogin.html";
};
_app.saveLocalData = () => {
  localStorage.host = JSON.stringify(_app.host);
};
_app.loadLocalStorage = () => {
  if (localStorage.host) {
    const parsedHost = JSON.parse(localStorage.host);
    if (!checkExpired(parsedHost.timeTokenCreation, Date.now(), 3590)){
      _app.clearLocalStorage();
      return;
    }
    _app.host = parsedHost;
  }
  if (localStorage.usersnames) {
    _app.usersnames = JSON.parse(localStorage.usersnames);
  }
  if (localStorage.users) {
    _app.users = JSON.parse(localStorage.users);
  }
  if (localStorage.playlist) {
    _app.playlistID = localStorage.playlist;
  }
  _app.detectPhase();
};
_app.requestArtist = async (genres, countries) => {
  const artists = await _app.sdm.getArtists(_app.host.token, genres, countries);

  let artistsHTML = "";
  artists.artists.items.forEach((artist) => {
    const img = artist.images[2].url
      ? `<img class="p-1" src=${artist.images[2].url}  alt="null" width="60" height="60"></img>`
      : "";
    artistsHTML += `
        <div class="col-12">
          <div class="artist-box">
              ${img}
              <label class="mx-1" for=>${artist.name} </label>
            <input type="checkbox" value=${artist.id} class="checkbox mx-3" id=${artist.id}>
          </div>
        </div>
        `;

  });
  _app.quizContainer.innerHTML = artistsHTML;
  
  qsa(".checkbox").forEach(item => {
    item.addEventListener('click', _app.selectionLimitQuiz(4));
  })

};

//funzioni che creano e gesticono la playlist finale
_app.initializePlaylist = () => {
  let responses3 = [];
  for (let i = 0; i < _app.users.length; i++) {
    responses3 = responses3.concat(_app.users[i].r3);
  }
  _app.requestPlaylist(uniqueArray(responses3).slice(0, 5));
};
_app.requestPlaylist = async (artists) => {
  const recommendedTracks = await _app.sdm.getPlaylist(_app.host.token,null, artists, _app.users);

  _app.playlistContainer = qs(".playlist-container");
  recommendedTracks.forEach((e) => {
    let songDiv = document.createElement("div");
    songDiv.className = "song-container";
    songDiv.id = `${e.id}`;
    
    let titleDiv = document.createElement("div");
    titleDiv.className = "title fs-5";
    titleDiv.innerHTML = `${e.name}`;
    titleDiv.id = `${e.id}`;
    
    let artistDiv = document.createElement("div");
    artistDiv.className = "artists fs-6";
    artistDiv.innerHTML = `${e.artists
      .map((artist) => artist.name)
      .join(", ")}`;

    let textInfo = document.createElement("div");
    textInfo.className = "info"
    textInfo.appendChild(titleDiv);
    textInfo.appendChild(artistDiv);

    let songImg = document.createElement("img");
    songImg.src = e.album.images[1].url;

    let deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "remove-button";
    deleteButton.innerHTML = "-";

    deleteButton.addEventListener("click", _app.removeSong);
    _app.playlistContainer.appendChild(songDiv);

    songDiv.appendChild(songImg);
    songDiv.appendChild(textInfo);
    songDiv.appendChild(deleteButton);
  });

  //PER CREARE IL BOTTONE (DOVREBBE GIA ESSERE NEL HTML)
  const button = document.createElement("button");
  button.className = "export-playlist";
  button.innerHTML = "Save to Spotify";
  button.addEventListener("click", _app.exportPlaylist);
  _app.playlistContainer.appendChild(button);
};
_app.removeSong = (e) => {
  e.target.parentElement.remove();
};
_app.exportPlaylist = async () => {
  _app.songs = [];
  const songs = qsa(".song-container");

  //todo: eliminare duplicati con uniqueArray
  songs.forEach((e) => {
    _app.songs.push(`spotify:track:${e.id}`);
  });
  _app.playlistID = await _app.sdm.exportPlaylist(
    _app.host.token,
    _app.host.id,
    _app.songs,
    "Playlist by Music Matcher"
  );
  localStorage.setItem("playlist", await _app.playlistID);
  document.location = "/app/pages/end.html";
};

_app.startUp();
