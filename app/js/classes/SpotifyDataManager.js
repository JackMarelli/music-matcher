import { generateCodeVerifier, generateCodeChallenge } from "../utils.js";
export default class SpotifyDataManager{
  #clientId = "5d488b4b52a34dfe8ef7a5db254489d2";
  #currentToken = null;
  #currentUser = null;
  #params = new URLSearchParams(window.location.search);
  #code = this.#params.get("code");
  #errorCode = "";
  #timeTokenCreation = null;

  constructor() {}

  async initAuthentication(){
    this.#redirectToAuthCodeFlow(this.#clientId);
  }

  async loadSpotifyHostData(){ 
    this.#errorCode = this.#params.get("error");
    if (this.#errorCode) document.getElementById("error").innerHTML = "ERRORE! Connessione con Spotify NON avvenuta correttamente.";

    if (this.#code && localStorage.length >= 1  ) {
      this.#currentUser = await this.changeToken();
      
      return await this.getProfile(this.#currentToken)
      .then(profile =>{

        profile.token = this.#currentUser.token;
        profile.timeTokenCreation = this.#currentUser.timeTokenCreation;
        return profile;
      });
    }

  }

  async changeToken(){
    this.#currentToken = await this.#getAccessToken(this.#clientId, this.#code);
    this.#timeTokenCreation = Date.now();
    // CHANGED TOKEN
    return {
      token: this.#currentToken,
      timeTokenCreation: this.#timeTokenCreation,
    }
  }
  

  async #redirectToAuthCodeFlow(clientId) {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem("verifier", verifier);
    
    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", "http://127.0.0.1:5500/app/pages/setup.html");
    params.append("scope", "user-read-private user-read-email playlist-modify-public playlist-modify-private ");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  async #getAccessToken(clientId, code) {
    const verifier = localStorage.getItem("verifier");

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", "http://127.0.0.1:5500/app/pages/setup.html");
    params.append("code_verifier", verifier);

    const result = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded"},
      body: params
    });

    const { access_token } = await result.json();
    
    return access_token;
  }

  async #fetchWebApi(token, endpoint, method, body) {
    const result = await fetch(`https://api.spotify.com/${endpoint}`, {
      method: method, 
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(body)
    });
    return (await result.json());
  }

  async getProfile(token) {
    return await this.#fetchWebApi(token, "v1/me", 'GET');
  }

  async getPlaylist(token, genres, artists, tracks, limit){ 
    //const seed_genres = genres.join(','); //DA SISTEMARE CONSIDERANDO TUTTE LE POSSIBILI CHIAMATE
    const seed_artists = artists.join(',');
    //const seed_tracks = tracks.join(',');
    //${limit} // `v1/recommendations?limit10=&seed_artists=${seed_artists}&seed_genres=${seed_genres}&seed_tracks=${seed_tracks}`
   
    const result = await this.#fetchWebApi(token, `v1/recommendations?limit10=&seed_artists=${seed_artists}`, 'GET');
    return await result.tracks; 
  }

  async getArtists(token , genres =[], countries = null){
      
      let filters = null;
      if(countries)filters = genres.concat(countries)
      else filters = genres;
      const seeds = filters.join(',');
      let result = await this.#fetchWebApi(token,`v1/search?q=%20genre:${seeds}&type=artist&limit=50&offset=3`, 'GET');

      //soluzione provvisoria
      console.log(await result.artists.items.length);
      if (await result.artists.items.length< 5 && filters !== genres ){
          return await this.getArtists(token, genres);
      }
      else return await result;
  }
  
  async exportPlaylist(token, user_id, tracksUri, name){
    
    const playlist = await this.#fetchWebApi(token,
      `v1/users/${user_id}/playlists`, 'POST', {
      "name": `${name}`,
      "description": "Playlist created by Albyeah",
      "public": false
    })
    
    await this.#fetchWebApi(token,`v1/playlists/${playlist.id}/tracks?uris=${tracksUri.join(',')}`,'POST');
    
    return playlist.id;
  }

}
