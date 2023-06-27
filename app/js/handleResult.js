import { getPlaylist } from "./handleRequests.js";
let  users = null;
let n = null;
let parsedHost  = null;

let responses1 = []
let responses3 = []
function start(){
    if (localStorage.host) {
        parsedHost = JSON.parse(localStorage.host);
    }
    if(localStorage.users){
        const parsedUsers = JSON.parse(localStorage.users);
        users = parsedUsers;
        n = users.length +1 
        console.log(users);
    }
    for (let i = 0; i < users.length; i++) {
        responses3 = responses3.concat(users[i].r3)
    }
    console.log(uniqueArray(responses3));
    requestPlaylist(uniqueArray(responses3).slice(0,4));

};

async function requestPlaylist(tracks){
    const recommendedTracks = await getPlaylist(parsedHost.token, null, tracks);
    console.log(recommendedTracks);
    const strTracks = recommendedTracks.map(
        ({name, artists, album}) =>
        `<br> ${name} by ${artists.map(artist => artist.name).join(', ')} 
        <img src=${album.images[0].url}  alt="null" width="60" height="60">`
    );
    
    document.querySelector("#full-playlist").innerHTML = strTracks;
}

function uniqueArray(arr) {
    let a = [];
    for (let i=0, l=arr.length; i<l; i++)
        if (a.indexOf(arr[i]) === -1 && arr[i] !== '')
            a.push(arr[i]);
    return a;
}

start()