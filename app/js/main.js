import { getPlaylist } from "./handlePlaylist.js";
import SpotifyDataManager from "./spotifyDataManager.js";
import User from "./User.js";

const _app = {};

_app.startUp = () =>{
    // ad ogni page e referesh
    _app.sdm = new SpotifyDataManager();
    _app.host = null;
    _app.initSpotifyData();
    
    //nella pagina di Login
    if (document.location.pathname.includes("spotifylogin.html")){
        document.querySelector(".buttonToken").addEventListener("click", _app.requestSpotifyAuth);  
        _app.inputLogin =  document.querySelector("#username");
    }
};


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
    if( _app.userNumber === 6 && localStorage.host){
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
            localStorage.users = JSON.stringify(usernameArray);
            _app.startQuiz(usernameArray);
        }
        
    }
    
}

_app.startQuiz=(usernames) => {
    console.log(usernames);
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

_app.detectPhase = () => {

    if(document.location.pathname.includes("pages") && !localStorage.host && !document.location.pathname.includes("spotifylogin.html")){
        document.location = '/app/pages/spotifylogin.html';
        console.log("ritorna indietro");
    }
    if(document.location.pathname.includes("spotifylogin.html") && localStorage.host){
        document.location = '/app/pages/setup.html';
    }
}

_app.requestSpotifyAuth = ()=> {
    if(!localStorage.host){
        _app.sdm.initAuthentication();
    } 
};

_app.initSpotifyData= ()=> {
    if(localStorage.host){
        _app.loadLocalHostData();
        _app.displayUser();
        _app.detectPhase();
    }
    else{
        _app.sdm.loadSpotifyHostData()
        .then(profile =>{
            if(!profile) return;
            _app.host = new User(profile.id, profile.display_name, profile.images[0].url, profile.token, profile.timeTokenCreation);
            _app.saveLocalData();
            _app.displayUser();
            _app.detectPhase();
        });
    }
}

_app.displayUser = () => {
    if(document.location.pathname.includes("setup.html")){
        _app.setupUsers(_app.host.username);
    }
    
    if (_app.host.img && document.location.pathname.includes("spotifylogin.html")) {
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
    // console.log(_app.user);
};

_app.loadLocalHostData = () => {
    if (localStorage.host) {
        const parsedHost = JSON.parse(localStorage.host);
        const currentTime = Date.now();
        let timeDiff = currentTime - parsedHost.timeTokenCreation;
        timeDiff /= 1000; //trasforma i millisecondi in secondi
        if(timeDiff >= 3590) { //3600
            _app.clearLocalStorage();
            return;
        }
        
        _app.host = parsedHost;
        
        
    }
};

_app.requestPlaylist = async () => {
    const limit = "20";
    const genres = ["indie"];
    const artists = ['4NHQUGzhtTLFvgF5SZesLK'];
    const tracks = ['2Cibr0RJo5kPxLJBDAv8Ry','5AXJPn1BS6L54Op3nb6jmk','5sWGPk7S6NGDLvOXRyWry8'];
    const recommendedTracks = await getPlaylist(_app.host.token, genres, artists, tracks, limit);
    console.log(recommendedTracks);
    const strTracks = recommendedTracks.map(
        ({name, artists, album}) =>
        `<br> ${name} by ${artists.map(artist => artist.name).join(', ')} 
        <img src=${album.images[0].url}  alt="null" width="60" height="60">
        `
    );
    document.querySelector("#fullPlaylist").innerHTML = strTracks;
    return
}

_app.startUp();