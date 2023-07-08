import { generateCodeVerifier, generateCodeChallenge } from "../utils.js";
export default class SpotifyDataManager{
  #clientId = "5d488b4b52a34dfe8ef7a5db254489d2";
  #currentUser = null;
  #params = new URLSearchParams(window.location.search);
  #code = this.#params.get("code");
  #errorCode = "";

  constructor() {}

  async initAuthentication(){
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem("verifier", verifier);
    
    const params = new URLSearchParams();
    params.append("client_id", this.#clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", "http://127.0.0.1:5500/app/pages/setup.html");
    params.append("scope", "user-read-private user-read-email playlist-modify-public playlist-modify-private ");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  async loadSpotifyHostData(){ 
    this.#errorCode = this.#params.get("error");
    if (this.#errorCode) document.getElementById("error").innerHTML = "Connection not esthablised correctly.";

    if (this.#code && localStorage.length >= 1) {
      this.#currentUser = {
        token: await this.#getAccessToken(this.#clientId, this.#code),
        timeTokenCreation: Date.now(),
      }

      return await this.getProfile(this.#currentUser.token)
      .then(profile =>{
        profile.token = this.#currentUser.token;
        profile.timeTokenCreation = this.#currentUser.timeTokenCreation;
        return profile;
      });
    }
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


  async #fetchEveryUserResponses(users, limit, token){
    let playlist = [];
    for await (let user of users) {
      const seeds = user.r3.slice(0,5).join(',');
      const res = await this.#fetchWebApi(token, `v1/recommendations?limit=${limit}&seed_artists=${seeds}`, 'GET');
      playlist = playlist.concat(res.tracks);
      console.log(playlist);
    }
    return playlist;
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

  async getPlaylist(token, genres, artists, users){ 
    let limit = Math.round(49/users.length);
    //const seed_genres = genres.join(','); //DA SISTEMARE 
    const seed_artists = artists.join(',');
  
    return await this.#fetchEveryUserResponses(users, limit, token); //per tornare alla vecchia generazione commentare questa riga

    const result = await this.#fetchWebApi(token, `v1/recommendations?limit=${limit}&seed_artists=${seed_artists}`, 'GET');
    console.log(await result.tracks);
    return await result.tracks; 
  }

  async getArtists(token , genres =[], countries = null){
    let filters = null;
    if(countries)filters = genres.concat(countries)
    else filters = genres;
    const seeds = filters.join(',');
    
    let result = await this.#fetchWebApi(token,`v1/search?q=%20genre:${seeds}&type=artist&limit=50&offset=3`, 'GET');
    console.log(seeds, result);
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
