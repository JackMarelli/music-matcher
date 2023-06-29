import { getArtists, getPlaylist, createPlaylist } from "./handleRequests.js";
import { qs,qsa, capitalize, uniqueArray } from "./utils.js";
import SpotifyDataManager from "./spotifyDataManager.js";
import Host from "./Host.js";

const _app = {};
_app.startUp = () =>{
    // ad ogni page e referesh
    _app.sdm = new SpotifyDataManager();
    _app.host = null;
    _app.usersnames = null;
    _app.users = [];
    _app.initSpotifyData();
    _app.quizPhaseCounter = 0;

    //nella pagina di Login
    if (document.location.pathname.includes("spotifylogin.html")){
        document.querySelector(".buttonToken").addEventListener("click", _app.requestSpotifyAuth);  
        _app.inputLogin =  document.querySelector("#username");
    }
};



//Funzioni che gestiscono i diversi users
_app.createUser= () => {
    if(_app.userNumber == 6)return;

    let userDiv = document.createElement("div");
    userDiv.className = "user";

    let deleteButton = document.createElement("button");
    deleteButton.type =  "button";
    deleteButton.className =  "button";
    deleteButton.innerHTML = "Remove";

    let labelUser = document.createElement("label");
    //labelUser.htmlFor =  _app.userNumber.toString();
    labelUser.innerHTML =  "Username:";

    let inputUser = document.createElement("input");
    //inputUser.id =  _app.userNumber.toString();
    inputUser.type =  "text";
    inputUser.className =  "userText";

    deleteButton.addEventListener("click", _app.removeUser); 
    _app.usersContainer.appendChild(userDiv);
    userDiv.appendChild(labelUser);
    userDiv.appendChild(inputUser);
    userDiv.appendChild(deleteButton);

    _app.userNumber++;
    
}
_app.removeUser= (e) => {
   e.path[1].remove();
   _app.userNumber--;
}
_app.getAndSaveUsername=() => {
    if( localStorage.host){
        let usernameArray = [];
        let incomplete = false;
        const usersArray = document.querySelectorAll(".userText");
        usersArray.forEach((user) => {
            if(user.value === ""){
               incomplete = true;
            }
            else{
                usernameArray.push(user.value);
            }
        })
        
        if (!incomplete){
            localStorage.usersnames = JSON.stringify(usernameArray);
            _app.startQuiz(usernameArray);
        }
    }
}
_app.startQuiz=(usernames) => {
    //console.log(usernames);
    localStorage.removeItem("verifier"); // non so se servirà in fututo
    document.location = '/app/pages/questions.html';
}
_app.setupUsers = (hostUsername = "") => {
    //nella pagina di SetUp
    if (document.location.pathname.includes("setup.html")){
        document.querySelector(".log-out").addEventListener("click", _app.clearLocalStorage);
        document.querySelector("#d").value = hostUsername;
        const startQuizButton = document.querySelector(".start-quiz");

        _app.usersContainer = document.querySelector(".input-box-wrapper");
        const addUserButton = document.querySelector(".add-user-button");
        _app.userNumber = 1;
        
        addUserButton.addEventListener("click", _app.createUser);
        startQuizButton.addEventListener("click", _app.getAndSaveUsername);
    }
}



//Funzioni che creano e gestiscono i quiz
_app.initializeQuiz = (host) => {
    _app.userIndex = 0;
    
    qs(".active-username").innerHTML = _app.usersnames[0];
    _app.quizOptions1 =  ["english", "italian", "spanish", "german", "greek", "norwegian", "russian", "mandarin", "romanian", "french" , "danish", "korean", "japanese", "portuguese"];
    _app.quizOptions2x =  ["acoustic", "afrobeat", "alt-rock", "alternative", "ambient", "anime", "black-metal", "bluegrass", "blues", "bossanova", "brazil", "breakbeat", "british", "cantopop", "chicago-house", "children", "chill", "classical", "club", "comedy", "country", "dance", "dancehall", "death-metal", "deep-house", "detroit-techno", "disco", "disney", "drum-and-bass", "dub", "dubstep", "edm", "electro", "electronic", "emo", "folk", "forro", "french", "funk", "garage", "german", "gospel", "goth", "grindcore", "groove", "grunge", "guitar", "happy", "hard-rock", "hardcore", "hardstyle", "heavy-metal", "hip-hop", "holidays", "honky-tonk", "house", "idm", "indian", "indie", "indie-pop", "industrial", "iranian", "j-dance", "j-idol", "j-pop", "j-rock", "jazz", "k-pop", "kids", "latin", "latino", "malay", "mandopop", "metal", "metal-misc", "metalcore", "minimal-techno", "movies", "mpb", "new-age", "new-release", "opera", "pagode", "party", "philippines-opm", "piano", "pop", "pop-film", "post-dubstep", "power-pop", "progressive-house", "psych-rock", "punk", "punk-rock", "r-n-b", "rainy-day", "reggae", "reggaeton", "road-trip", "rock", "rock-n-roll", "rockabilly", "romance", "sad", "salsa", "samba", "sertanejo", "show-tunes", "singer-songwriter", "ska", "sleep", "songwriter", "soul", "soundtracks", "spanish", "study", "summer", "swedish", "synth-pop", "tango", "techno", "trance", "trip-hop", "turkish", "work-out", "world-music"];
    _app.quizOptions2 =  ["acoustic", "afrobeat", "alternative", "black-metal",  "blues", "bossanova",  "children", "chill", "classical", "country", "dance", "dancehall", "death-metal", "disco", "disney", "drum-and-bass",  "dubstep", "edm", "electro", "electronic", "emo", "folk",  "funk", "garage", "german", "gospel", "goth", "groove", "grunge", "guitar", "hard-rock", "hardcore", "hardstyle", "heavy-metal", "hip-hop", "holidays", "honky-tonk", "house", "idm", "indian", "indie", "indie-pop", "industrial", "iranian", "j-dance", "j-idol", "j-pop", "j-rock", "jazz", "k-pop", "kids", "latin", "latino",  "metal", "metalcore", "minimal-techno", "movies", "mpb",  "opera",  "party",  "piano", "pop", "pop-film", "post-dubstep", "power-pop", "progressive-house", "psych-rock", "punk", "punk-rock", "r-n-b", "reggae", "reggaeton", "rock", "rock-n-roll", "rockabilly", "romance", "sad", "salsa", "samba", "show-tunes", "singer-songwriter",  "sleep", "songwriter", "soul", "soundtracks",  "study", "summer", "synth-pop", "tango", "techno", "work-out", "world-music"];

    qs(".submit").addEventListener("click", _app.registerQuizResponse)
    _app.createQuiz(_app.quizOptions1);
}
_app.createQuiz= (options) => {

    _app.quizContainer = document.querySelector(".input-box-wrapper");
    for (let option of options){
        _app.quizContainer.innerHTML += `
        <div class="box">
            <input type="checkbox" value=${option} class="checkbox" id=${option}>
            <label for=${option}>${capitalize(option)}</label>
        </div>
        `
    }
   
}
_app.handleQuiz = (result) => {

    _app.quizPhaseCounter++;
    //console.log(_app.quizPhaseCounter);
    _app.quizContainer.innerHTML = '';
    //console.log(_app.quizPhaseCounter);
    if(_app.quizPhaseCounter == 0){
        
    }
    else if(_app.quizPhaseCounter == 1){
        _app.createQuiz(_app.quizOptions2);
        _app.quizResponse1 = result;
    }     
    else if(_app.quizPhaseCounter== 2){
        _app.quizResponse2 = result;
        console.log("FASE 2")
        _app.requestArtist(_app.quizResponse1,_app.quizResponse2);
    }
    else if(_app.quizPhaseCounter== 3){
        console.log("FASE 3")
        _app.quizResponse3 = result;
        const obj = {
            username: _app.usersnames[_app.userIndex],
            r1: _app.quizResponse1 ,
            r2: _app.quizResponse2 ,
            r3: _app.quizResponse3,
        }
        _app.users.push(obj)
        
        console.log("salvare user e passare al prossimo");
        _app.userIndex++;
        _app.quizPhaseCounter= 0;
        
        
        
        if ( !_app.usersnames[_app.userIndex ]){
            localStorage.setItem("users", JSON.stringify(_app.users));
            _app.quizContainer.innerHTML = '';
            console.log("FINE QUIZ");
            document.location = '/app/pages/result.html';
        }
        else{
            qs(".active-username").innerHTML = _app.usersnames[_app.userIndex];
            _app.createQuiz(_app.quizOptions1);
        } 
        
    }
}
_app.registerQuizResponse= () => {
    
    let checkboxes = document.querySelectorAll(".checkbox");
    let resultsArray = [];
    for (let checkbox of checkboxes){
        if(checkbox.checked == true) resultsArray.push(checkbox.value);
        else resultsArray = resultsArray.filter(e =>  e !== checkbox.value);     
    }
   //console.log(resultsArray);
    if(resultsArray.length > 0){
       _app.handleQuiz(resultsArray);
    }
}



//Funzioni principali e generali
_app.detectPhase = () => {
    if(document.location.pathname.includes("pages") && !localStorage.host && !document.location.pathname.includes("spotifylogin")){
        document.location = '/app/pages/spotifylogin.html';
    }
    if(document.location.pathname.includes("spotifylogin.html") && localStorage.host){
        document.location = '/app/pages/setup.html';
    }
    if(document.location.pathname.includes("setup.html") && _app.host){
        _app.setupUsers(_app.host.username);
    }
    if(document.location.pathname.includes("questions.html") && _app.host){
        _app.initializeQuiz(_app.host);
    }
    if(document.location.pathname.includes("result.html")){
        if(localStorage.users)_app.initializePlaylist();
        else document.location = '/app/pages/spotifylogin.html';
    }
}
_app.requestSpotifyAuth = ()=> {
    if(!localStorage.host) _app.sdm.initAuthentication();
};
_app.initSpotifyData= ()=> {
    if(localStorage.host){
        _app.loadLocalStorage();
        
        _app.displayUser();  // per mostrare icona spotify da riposizionare
    }
    else{
        _app.sdm.loadSpotifyHostData()
        .then(profile =>{
            if(profile) {
                _app.host = new Host(profile.id, profile.display_name, profile.images[0].url, profile.token, profile.timeTokenCreation);
                _app.saveLocalData();
                _app.displayUser();  // per mostrare icona spotify da riposizionare
            }
            _app.detectPhase(); 
        });
    }
}
_app.displayUser = () => {
    if (_app.host.img && document.location.pathname.includes("setup.html")) {
        const profileImage = new Image(50, 50);
        profileImage.src = _app.host.img;
        document.getElementById("avatar").appendChild(profileImage);
    }

    
}
_app.clearLocalStorage = () => {
    localStorage.clear();
    document.location = '/app/pages/spotifylogin.html';
};
_app.saveLocalData = () => {
	localStorage.host = JSON.stringify(_app.host);
};
_app.loadLocalStorage = () => {
    if (localStorage.host) {
        const parsedHost = JSON.parse(localStorage.host);
        const currentTime = Date.now(); //METTERE TUTTO IL CHECK NEGLI UTILS
        let timeDiff = currentTime - parsedHost.timeTokenCreation;
        timeDiff /= 1000; //trasforma i millisecondi in secondi 
        if(timeDiff >= 3590) { //3600
            _app.clearLocalStorage();
            return;
        }
        _app.host = parsedHost;
    }
    if(localStorage.usersnames){
        _app.usersnames = JSON.parse(localStorage.usersnames);
    }
    if(localStorage.users){
        _app.users = JSON.parse(localStorage.users);
    }
    if(localStorage.playlist){
       _app.playlist = localStorage.playlist;
    
    }
    _app.detectPhase();
};
_app.requestArtist = async (genres, countries) => {
    const artists = await getArtists(_app.host.token, genres, countries);
    console.log(artists);

    let artistsHTML = "";
    artists.artists.items.forEach(artist => {
        const img = (artist.images[2].url) ?`<img src=${artist.images[2].url}  alt="null" width="60" height="60"></img>` : "";
        artistsHTML += `
        <div class="box">
            <input type="checkbox" value=${artist.id} class="checkbox" id=${artist.id}>
            <label for=>${artist.name} </label>
            ${img}
        </div>
        `
    });
    _app.quizContainer.innerHTML = artistsHTML;
}



//funzioni che creano e gesticono la playlist finale
_app.initializePlaylist= () => {
    let responses3 = [];
    //console.log(_app.users);
    for (let i = 0; i < _app.users.length; i++) {
        responses3 = responses3.concat(_app.users[i].r3)
    }
    console.log(uniqueArray(responses3));
    _app.requestPlaylist(uniqueArray(responses3).slice(0,5));
};
_app.requestPlaylist = async (tracks)=> {
    const recommendedTracks = await getPlaylist(_app.host.token, null, tracks);
    _app.songsContainer = qs(".playlist-container");

    recommendedTracks.forEach(e => {
        let songDiv = document.createElement("div");
        songDiv.className = "song-container";
        songDiv.id = `${e.id}`;

        let songTitle = document.createElement("p");
        songTitle.innerHTML = `${e.name} by ${e.artists.map(artist => artist.name).join(', ')}`;

        let songImg = document.createElement("img");
        songImg.src = `${e.album.images[1].url} `;
        songImg.width = "60";
        
        let deleteButton = document.createElement("button");
        deleteButton.type =  "button";
        deleteButton.className =  "remove-button";
        deleteButton.innerHTML = "Remove";

        deleteButton.addEventListener("click", _app.removeSong); 
        _app.songsContainer.appendChild(songDiv);
        songDiv.appendChild(songTitle);
        songDiv.appendChild(songImg);
        songDiv.appendChild(deleteButton);
    });
    
    //PER CREARE IL BOTTONE (DOVREBBE GIA ESSERE NEL HTML)
    const button = document.createElement("button");
    button.className = "export-playlist";
    button.innerHTML = "Save to Spotify"
    button.addEventListener("click", _app.createPlaylist);
    _app.songsContainer.appendChild(button);
}
_app.removeSong = (e) => {
    e.path[1].remove();
}
_app.createPlaylist = async () => {
    _app.songs = [];
    const songs = qsa(".song-container");
    songs.forEach(e => {
        _app.songs.push(`spotify:track:${e.id}`);
    })
    _app.playlistID = await createPlaylist(_app.host.token, _app.host.id, _app.songs);
    localStorage.setItem("playlist", await _app.playlistID);

    //window.location.replace(`https://open.spotify.com/playlist/${_app.playlistID}`);
    
}

_app.startUp();