async function fetchWebApi(token, endpoint, method, body) {
    const result = await fetch(`https://api.spotify.com/${endpoint}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method,
        body:JSON.stringify(body)
    });
    return await result.json();
}

async function getPlaylist(token, genres, artists, tracks, limit){ 
    //const seed_genres = genres.join(','); //DA SISTEMARE CONSIDERANDO TUTTE LE POSSIBILI CHIAMATE
    const seed_artists = artists.join(',');
    //const seed_tracks = tracks.join(',');
    
    //${limit}
    async function getRecommendations(){
        // `v1/recommendations?limit10=&seed_artists=${seed_artists}&seed_genres=${seed_genres}&seed_tracks=${seed_tracks}`
            return (await fetchWebApi(token,
            `v1/recommendations?limit10=&seed_artists=${seed_artists}`, 'GET'
            
        )).tracks;    
    }
    return await getRecommendations();
}

async function getArtists(token , genres =[], countries = []){
    const filters = genres.concat(countries)
    //const filters = artists
    const seeds = filters.join(',');

    async function getArtistRecommendations(){
        // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-recommendations
            return (await fetchWebApi(token,
            `v1/search?q=%20genre:${seeds}&type=artist&limit=50&offset=3`, 'GET'
            
        ));
    }

    //soluzione provvisoria
    let result = await getArtistRecommendations();
    if (await result.artists.items.length< 5){
        console.log(countries);
        return await getArtists(token , genres);
        
    }
    else return await result;
}


const tracksUri = [
    'spotify:track:3USTT2XAeWrO2ytAqsc1pe','spotify:track:24ypJV5Jdt7MOSDrrPu2M8','spotify:track:0hReXAWKqGzHBYnw0S1CXu','spotify:track:0ei5muxdohCWLBGZLqdRXd','spotify:track:3CmcuojFmw6lD6IFqlMY6l','spotify:track:7FsuMwalG48ZfjklkSkuJa','spotify:track:16UKRoJsS0i0eUNCCroz7n','spotify:track:6arjHcZGseJYCALGwcEi4y','spotify:track:5AXJPn1BS6L54Op3nb6jmk','spotify:track:3PbazHXYd4p53L8ygiPh8A'
];
  
async function createPlaylist(token, user_id, tracksUri){
  
    const playlist = await fetchWebApi(token,
        `v1/users/${user_id}/playlists`, 'POST', {
        "name": "Playlist by Music Matcher",
        "description": "Playlist created by Albyeah",
        "public": false
    })
  
    await fetchWebApi(token,
      `v1/playlists/${playlist.id}/tracks?uris=${tracksUri.join(',')}`,
      'POST'
    );
  
    return playlist.id;
}

export { getPlaylist, getArtists, createPlaylist};