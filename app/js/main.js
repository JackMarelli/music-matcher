import { capitalize, checkExpired, qs, qsa, uniqueArray, pathIncludes,} from "./utils.js";
import { showTurnLoader, waitingDots } from "./animations.js";
import SpotifyDataManager from "./classes/SpotifyDataManager.js";
import Host from "./classes/Host.js";
import Playlist from "./classes/Playlist.js";
import Song from "./classes/Song.js";
import User from "./classes/User.js";

const _app = {};
_app.startUp = () => {
  _app.sdm = new SpotifyDataManager();
  _app.host = null;
  _app.usersnames = null;
  _app.users = [];
  _app.quizPhaseCounter = 0;

  _app.initSpotifyData();
};

//Handle User 
_app.createUser = () => {
  if (_app.userNumber == 5) return;
  else if (_app.userNumber == 4) _app.addUserButton.className += " d-none";

  let userDiv = document.createElement("div");
  userDiv.className = "w-100 d-flex justify-content-start align-items-center text-input mb-2 user";

  let userImg = document.createElement("img");
  userImg.src = "../assets/images/svg/user.svg";

  let deleteButton = document.createElement("button");
  let removeImg = document.createElement("img");
  removeImg.src = "../assets/images/svg/remove.svg";

  let inputUser = document.createElement("input");
  inputUser.type = "text";
  inputUser.className = "w-100 h-100 userText";
  inputUser.placeholder = "Insert username";
  inputUser.maxLength = "10";

  _app.usersContainer.insertBefore(userDiv,_app.usersContainer.childNodes[_app.usersContainer.childElementCount]);
  userDiv.appendChild(userImg);
  userDiv.appendChild(inputUser);
  userDiv.appendChild(deleteButton);
  deleteButton.appendChild(removeImg);
  deleteButton.addEventListener("click", function (e) {
    if (e.target !== this) _app.removeUser(e.target);
  });

  _app.userNumber++;
};

_app.getAndSaveUsername = () => {
  if (localStorage.host) {
    let usernameArray = [];
    let incompleteArray = [];
    const usersArray = qsa(".userText");
    usersArray.forEach((user) => {
      if (user.value === "") {
        incompleteArray.push(user);
      } else usernameArray.push(user.value);
    });

    if (incompleteArray.length > 0) {
      incompleteArray.forEach((e) => {
        e.parentElement.classList.add("username-error");
      });
    } else {
      localStorage.usersnames = JSON.stringify(usernameArray);
      _app.startQuiz(usernameArray);
    }
  }
};

_app.removeUser = (e) => {
  if (_app.userNumber == 5)_app.addUserButton.className = _app.addUserButton.className.slice(0, -7);
  e.parentElement.parentElement.remove();
  _app.userNumber--;
};

_app.startQuiz = () => {
  localStorage.removeItem("verifier"); // non so se servirà in fututo
  document.location = "/app/pages/questions.html";
};

_app.setupUsers = (hostUsername = "") => {
  //only in setup page
  if (pathIncludes("setup.html")) {
    qs(".log-out").addEventListener("click", _app.clearLocalStorage);
    qs("#d").value = hostUsername;
    const startQuizButton = qs(".start-quiz");

    _app.usersContainer = qs(".input-box-wrapper");
    _app.addUserButton = qs(".add-button");
    _app.userNumber = 1;

    _app.addUserButton.addEventListener("click", _app.createUser);
    startQuizButton.addEventListener("click", _app.getAndSaveUsername);
  }
};


//Handle Quiz
_app.createQuiz = (options) => {
  _app.quizContainer = qs(".input-box-wrapper");
  for (let option of options) {
    let quizDiv = document.createElement("div");
    quizDiv.className = "box";

    let inputQuiz = document.createElement("input");
    inputQuiz.type = "checkbox";
    inputQuiz.className = "checkbox";
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

_app.handleQuiz = (result) => {
  _app.quizPhaseCounter++;
  _app.quizContainer.innerHTML = "";

  if (_app.quizPhaseCounter == 1) {
    _app.quizResponse1 = result;
    _app.setQuizTitles("What mood are you in?", 1);
    _app.createQuiz(_app.quizOptions2);
  } else if (_app.quizPhaseCounter == 2) {
    _app.quizResponse2 = result;
    _app.setQuizTitles("Pick your favorite artists:", 4);
    _app.requestArtist(_app.quizResponse2, _app.quizResponse1);
  } else if (_app.quizPhaseCounter == 3) {
    _app.quizResponse3 = result;
    const obj = new User(_app.usersnames[_app.userIndex],_app.quizResponse1,_app.quizResponse2,_app.quizResponse3);
    _app.users.push(obj);

    _app.userIndex++;
    _app.quizPhaseCounter = 0;

    if (!_app.usersnames[_app.userIndex]) {
      if (localStorage.playlist)localStorage.removeItem("playlist");
      localStorage.users = JSON.stringify(_app.users);
      document.location = "/app/pages/result.html";
    } else {
      showTurnLoader(_app.usersnames[_app.userIndex]);
      qs(".active-username").innerHTML = _app.usersnames[_app.userIndex];
      _app.createQuiz(_app.quizOptions1);
    }
  }
};

_app.initializeQuiz = (host) => {
  showTurnLoader(_app.usersnames[0]);
  _app.userIndex = 0;
  qs(".active-username").innerHTML = _app.usersnames[0];
  _app.quizOptions1 = [
    "english",
    "italian",
    "spanish",
    "german",
    "greek",
    "norwegian",
    "russian",
    "mandarin",
    "romanian",
    "french",
    "danish",
    "korean",
    "japanese",
    "portuguese",
  ];

  _app.quizOptions2 = [
    "acoustic",
    "alternative",
    "black-metal",
    "blues",
    "chill",
    "classical",
    "country",
    "dance",
    "death-metal",
    "disco",
    "drum-and-bass",
    "dubstep",
    "edm",
    "folk",
    "funk",
    "garage",
    "grunge",
    "guitar",
    "hard-rock",
    "hardcore",
    "hardstyle",
    "heavy-metal",
    "hip-hop",
    "house",
    "idm",
    "indie",
    "industrial",
    "jazz",
    "kids",
    "latino",
    "metal",
    "opera",
    "piano",
    "pop",
    "punk",
    "punk-rock",
    "r-n-b",
    "reggae",
    "reggaeton",
    "rock",
    "rock-n-roll",
    "salsa",
    "samba",
    "soul",
    "synth-pop",
    "tango",
    "techno",
  ];

  qs(".submit").addEventListener("click", _app.registerQuizResponse);
  _app.createQuiz(_app.quizOptions1);
};

_app.registerQuizResponse = () => {
  let checkboxes = qsa(".checkbox");
  let resultsArray = [];
  for (let checkbox of checkboxes) {
    if (checkbox.checked == true) resultsArray.push(checkbox.value);
    else resultsArray = resultsArray.filter((e) => e !== checkbox.value);
  }

  if (resultsArray.length > 0) {
    _app.handleQuiz(resultsArray);
  }
};

_app.setQuizTitles = (title = "", n = 1) => {
  const quizTitle = qs(".quiz-title");
  const maxTitle = qs(".quiz-title-max");
  if (quizTitle) quizTitle.innerHTML = title;
  if (maxTitle) maxTitle.innerHTML = `max. ${n}`;
};

_app.selectionLimitQuiz = (n) => {
  let checks = qsa(".checkbox");
  for (let i = 0; i < checks.length; i++) checks[i].onclick = selectiveCheck;
  function selectiveCheck() {
    let checkedChecks = qsa(".checkbox:checked");
    if (checkedChecks.length >= n + 1) return false;
  }
};


//General
_app.detectPhase = () => {
  if (
    pathIncludes("pages") &&
    !localStorage.host &&
    !pathIncludes("spotifylogin")
  ) {
    let err = "";
    let params = new URLSearchParams(window.location.search);
    if (params.get("error")) err = "?error=access_denied";
    document.location = "/app/pages/spotifylogin.html" + err;
  }
  if (pathIncludes("spotifylogin.html")) {
    if(localStorage.host) document.location = "/app/pages/setup.html";
    qs(".buttonToken").addEventListener("click", _app.requestSpotifyAuth);
    _app.inputLogin = qs("#username");
  }
  else if (pathIncludes("setup.html") && _app.host) {
    _app.setupUsers(_app.host.username);
  } else if (pathIncludes("questions.html") && _app.host) {
    _app.initializeQuiz(_app.host);
  } else if (pathIncludes("result.html")) {
    if (localStorage.users) _app.initializePlaylist();
    else document.location = "/app/pages/spotifylogin.html";
  } else if (pathIncludes("end.html")) {
    if (localStorage.playlist) {
      qs(".redirect-playlist").addEventListener("click", function () {
        window.open(
          `https://open.spotify.com/playlist/${_app.playlist.url}`,
          "_blank"
        ) ||
          window.location.replace(
            `https://open.spotify.com/playlist/${_app.playlist.url}`
          );
      });
    } else document.location = "/app/pages/login.html";
  }
};

_app.requestSpotifyAuth = () => {
  if (!localStorage.host) _app.sdm.authentication();
};

_app.initSpotifyData = () => {
  if (localStorage.host) {
    _app.loadLocalStorage();
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
      }
      _app.detectPhase();
    });
  }
};

_app.displayUser = () => {
  if (_app.host && pathIncludes("setup.html")) {
    const profileImage = new Image(50, 50);
    profileImage.src = _app.host.img;
    qs("#avatar").appendChild(profileImage);
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
    if (!checkExpired(parsedHost.timeTokenCreation, Date.now(), 3590)) {
      _app.clearLocalStorage();
      return;
    }
    _app.host = parsedHost;
  }
  if (localStorage.usersnames) {
    _app.usersnames = JSON.parse(localStorage.usersnames);
  }
  if (localStorage.users) {
    if (pathIncludes("questions.html")) localStorage.removeItem("users");
    else _app.users = JSON.parse(localStorage.users);
  }
  if (localStorage.playlist) {
    _app.playlist = JSON.parse(localStorage.playlist);
  }
  _app.detectPhase();
};

_app.requestArtist = async (genres, countries) => {
  const artists = await _app.sdm.getArtists(_app.host.token, genres, countries);

  let artistsHTML = "";
  artists.artists.items.forEach((artist) => {
    const img = artist.images[1]
      ? artist.images[1].url
      : "../assets/images/jpg/image-not-found.jpg";
    artistsHTML += `
        <div class="col-12">
          <div class="artist-box">
            <img class="p-1" src=${img}></img>
              <label class="mx-1" for=>${artist.name} </label>
            <input type="checkbox" value=${artist.id} class="checkbox mx-3" id=${artist.id}>
          </div>
        </div>`;
  });
  _app.quizContainer.innerHTML = artistsHTML;
  qsa(".checkbox").forEach((item) => {
    item.addEventListener("click", _app.selectionLimitQuiz(4));
  });
};


//Handle result Playlist
_app.exportPlaylist = async () => {
  _app.ids = [];
  _app.playlist.songs.forEach((s) => {
    _app.ids.push(`spotify:track:${s.id}`);
  });

  _app.playlist.url = await _app.sdm.exportPlaylist(
    _app.host.token,
    _app.host.id,
    _app.ids,
    _app.playlistName
  );
  console.log(_app.playlist.url);
  _app.playlist.saveToLocalStorage();
  document.location = "/app/pages/end.html";
};

_app.initializePlaylist = () => {
  let responses3 = [];
  for (let i = 0; i < _app.users.length; i++) {
    responses3 = responses3.concat(_app.users[i].r3);
  }
  _app.requestPlaylist(uniqueArray(responses3).slice(0, 5));
};

_app.removeSong = (e, id) => {
  e.target.parentElement.remove();
  _app.playlist.removeSong(id) ;
};

_app.requestPlaylist = async (artists) => {
  _app.playlistContainer = qs(".playlist-container");
  _app.playlistContainer.innerHTML = `<div class="waiting">waiting</div>`;
  waitingDots();

  if (!_app.playlist) {
    const recommendedTracks = await _app.sdm.getPlaylist(
      _app.host.token,
      artists,
      _app.users
    );
    _app.playlist = new Playlist();
    recommendedTracks.forEach((track) => {
      const s = new Song(track.id, track.album.images[1].url, track.name);
      track.artists.forEach((a) => {
        s.artists.push(a.name);
      });
      _app.playlist.addSong(s);
    });
    _app.playlist.saveToLocalStorage();
  }
  else{
    let oldPlaylist = _app.playlist;
    _app.playlist = new Playlist();
    oldPlaylist.songs.forEach((track) => {
      const s = new Song(track.id, track.img, track.name);
      s.artists = track.artists;
      _app.playlist.addSong(s);
    });
    oldPlaylist.url =  _app.playlist.url;
    _app.playlist.saveToLocalStorage();
  }

  _app.playlistContainer.innerHTML = "";
  _app.playlist.songs.forEach((song) => {
    let songDiv = document.createElement("div");
    songDiv.className = "song-container";
    songDiv.id = `${song.id}`;

    let titleDiv = document.createElement("div");
    titleDiv.className = "title fs-5";
    titleDiv.innerHTML = `${song.name}`;
    titleDiv.id = `${song.id}`;

    let artistDiv = document.createElement("div");
    artistDiv.className = "artists fs-6";
    artistDiv.innerHTML = `${song.artists.join(", ")}`;

    let textInfo = document.createElement("div");
    textInfo.className = "info";
    textInfo.appendChild(titleDiv);
    textInfo.appendChild(artistDiv);

    let songImg = document.createElement("img");
    songImg.src = song.img;

    let deleteButton = document.createElement("img");
    deleteButton.className = "remove-button cursor-pointer";
    deleteButton.src = "../assets/images/svg/remove-song.svg";

    deleteButton.addEventListener("click", function(e){ _app.removeSong(e, song.id)});
    _app.playlistContainer.appendChild(songDiv);
    songDiv.appendChild(songImg);
    songDiv.appendChild(textInfo);
    songDiv.appendChild(deleteButton);
  });

  const btnSaveToSpotify = qs("#saveToSpotify");
  if (btnSaveToSpotify) {
    btnSaveToSpotify.addEventListener("click", () => {
      _app.playlistName = qs("#playlistNameInputField").value.trim();
      if (_app.playlistName === "") {
        const popup = qs("#confirmUnnamedPlaylist");
        popup.classList.add("mm-popup-active");
        qs("#confirmExport").addEventListener("click", () => {
          _app.playlistName = "Playlist by Music Matcher";
          _app.exportPlaylist();
        });
        qs(".close-icon").addEventListener("click", () => {
          popup.classList.remove("mm-popup-active");
        });
      } else {
        _app.exportPlaylist();
      }
    });
  }
};

_app.startUp();