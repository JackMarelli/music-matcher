const _app = {};

_app.startUp = () =>{
    console.log("Start Up");
    document.querySelector(".buttonTest").addEventListener("click", _app.initSpotifyAPI);  
};

_app.initSpotifyAPI = ()=> {
    const clientId = '5d488b4b52a34dfe8ef7a5db254489d2';
    const clientSecret = '696c594f99be4ddb80275b53592f2513';
    _app.requestToken(clientId, clientSecret);
};

_app.requestToken = async(clientId,clientSecret)=>{
    const result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/x-www-form-urlencoded', 
            'Authorization' : 'Basic ' + btoa(clientId + ':' + clientSecret)
        },
        body: 'grant_type=client_credentials'
    });

    const data = await result.json();
    document.querySelector(".test2").innerHTML = "Spotify Token goes here: " + data.access_token;
    console.log(data)
};

_app.startUp();