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

async function getArtists(token , genres =[], artists = []){
    const filters = genres.concat(artists)
    //const filters = artists
    const seeds = filters.join(',');

    async function getArtistRecommendations(){
        // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-recommendations
            return (await fetchWebApi(token,
            `v1/search?q=%20genre:${seeds}&type=artist&limit=50&offset=3`, 'GET'
            
        ));
    }
    return await getArtistRecommendations();
}

export { getPlaylist, getArtists};