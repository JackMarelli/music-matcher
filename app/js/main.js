import { getPlaylist } from "./handlePlaylist.js";
import SpotifyDataManager from "./spotifyDataManager.js";
import User from "./User.js";

const _app = {};

_app.startUp = () =>{
    // console.log("Start Up");
    _app.sdm = new SpotifyDataManager();
    _app.initSpotifyData();
    _app.user = null;
    document.querySelector(".buttonToken").addEventListener("click", _app.requestSpotifyAuth);  
    document.querySelector(".buttonReset").addEventListener("click", _app.clearLocalStorage);   
};

_app.requestSpotifyAuth = ()=> {
    if(!localStorage.user){
        _app.sdm.initAuthentication();
    } 
};

_app.initSpotifyData= ()=> {
    if(localStorage.user){
        _app.loadLocalUserData();
        _app.displayUser();
        _app.requestPlaylist();
    }
    else{
        _app.sdm.loadSpotifyUserData()
        .then(profile =>{
            if(!profile) return;
            _app.user = new User(profile.display_name, profile.images[0].url, profile.token, profile.timeTokenCreation);
            _app.saveLocalData();
            _app.displayUser();
            _app.requestPlaylist();
        });
    }
}

_app.displayUser = () => {
    document.querySelector(".buttonToken").style.display = "none";
    document.querySelector("#playlist").style.display = "inline";
    document.querySelector(".buttonReset").style.display = "inline";
    document.getElementById("username").innerText = _app.user.username;
    
    if (_app.user.img) {
        const profileImage = new Image(200, 200);
        profileImage.src = _app.user.img;
        document.getElementById("avatar").appendChild(profileImage);
    }
}
_app.clearLocalStorage = () => {
    localStorage.clear();
    location.reload();
};

_app.saveLocalData = () => {
	localStorage.user = JSON.stringify(_app.user);
    // console.log(_app.user);
};

_app.loadLocalUserData = () => {
    if (localStorage.user) {
        const parsedUser = JSON.parse(localStorage.user);
        const currentTime = Date.now();
        // console.log(currentTime, parseInt(parsedUser.timeTokenCreation) )
        let timeDiff = currentTime - parsedUser.timeTokenCreation;
        timeDiff /= 1000; //trasforma i millisecondi in secondi
        if(timeDiff >= 3590) { //3600
            _app.clearLocalStorage();
            return;
        }
        
        _app.user = parsedUser;
        
        // console.log(_app.user);
        
    }
};

_app.requestPlaylist = async () => {
    // console.log(_app.user);
    const limit = "20";
    //MASSIMO 5 VALORI COMPLESSIVI CI DEVONO IN QUESTI TRE ARRAY
    const genres = ["indie"];
    const artists = ['4NHQUGzhtTLFvgF5SZesLK'];
    const tracks = ['2Cibr0RJo5kPxLJBDAv8Ry','5AXJPn1BS6L54Op3nb6jmk','5sWGPk7S6NGDLvOXRyWry8'];
    
    
    
    const recommendedTracks = await getPlaylist(_app.user.token, genres, artists, tracks, limit);
    console.log(recommendedTracks);
    const strTracks = recommendedTracks.map(
        ({name, artists, album}) =>
        `<br> ${name} by ${artists.map(artist => artist.name).join(', ')} 
        <img src=${album.images[0].url}  alt="null" width="60" height="60">
        `
    );

    document.querySelector("#fullPlaylist").innerHTML = strTracks;
}

_app.startUp();