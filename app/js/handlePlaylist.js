async function getPlaylist(token, genres, artists, tracks, limit){
    async function fetchWebApi(endpoint, method, body) {
        const result = await fetch(`https://api.spotify.com/${endpoint}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            method,
            body:JSON.stringify(body)
        });
        return await result.json();
    }

    const seed_genres = genres.join(',');
    const seed_artists = artists.join(',');
    const seed_tracks = tracks.join(',');
    

    async function getRecommendations(){
        // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-recommendations
            return (await fetchWebApi(
            `v1/recommendations?limit=${limit}&seed_artists=${seed_artists}&seed_genres=${seed_genres}&seed_tracks=${seed_tracks}`, 'GET'
            
        )).tracks;
        
        // EXAMPLE`v1/recommendations?limit=5&seed_artists=${seed_artists.join(',')}&seed_genres=${seed_genres.join(',')}&seed_tracks=${seed_tracks.join(',')}`
        
    }
    
    const recommendedTracks = await getRecommendations();
    const strTracks = recommendedTracks.map(
        ({name, artists}) =>
        `<br> ${name} by ${artists.map(artist => artist.name).join(', ')} `
    );
    return strTracks;
}

function exportPlaylist(){

}

export { getPlaylist, exportPlaylist};