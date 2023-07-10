import { generateCodeVerifier, generateCodeChallenge , shuffleArray} from "../utils.js";
export default class SpotifyDataManager {
  #clientId = "5d488b4b52a34dfe8ef7a5db254489d2";
  #currentUser = null;
  #errorCode = "";
  #params = new URLSearchParams(window.location.search);
  #code = this.#params.get("code");

  constructor() {}

  async authentication() {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);
    localStorage.setItem("verifier", verifier);
    const params = new URLSearchParams();
    params.append("client_id", this.#clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", "http://127.0.0.1:5500/app/pages/setup.html");
    params.append(
      "scope",
      "user-read-private user-read-email playlist-modify-public playlist-modify-private "
    );
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);
    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  async exportPlaylist(token, user_id, tracksUri, name) {
    const playlist = await this.#fetchWebApi(token,`v1/users/${user_id}/playlists`,"POST",
      {
        name: `${name}`,
        description: `Created by ${user_id} via Music Matcher`,
        public: false,
      }
    );

    await this.#fetchWebApi(token,`v1/playlists/${playlist.id}/tracks?uris=${tracksUri.join(",")}`,"POST");
    return playlist.id;
  }

  async #fetchEveryUserResponses(users, token) {
    let limit = Math.floor(50 / users.length);
    let playlist = [];
    for await (let user of users) {
      const seeds = user.r3.slice(0, 5).join(",");
      const res = await this.#fetchWebApi(token,`v1/recommendations?limit=${limit}&seed_artists=${seeds}`,"GET");
      playlist = playlist.concat(res.tracks);
      console.log(playlist);
    }
    return playlist;
  }


  async #fetchWebApi(token, endpoint, method, body) {
    const result = await fetch(`https://api.spotify.com/${endpoint}`, {
      method: method,
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
    return await result.json();
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
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });

    const { access_token } = await result.json();
    return access_token;
  }

  async getProfile(token) {
    return await this.#fetchWebApi(token, "v1/me", "GET");
  }

  async getPlaylist(token, users) {
    //return await this.#fetchEveryUserResponses(users, token); 
    let playlist = [];
    let seeds = [];
    for (let user of users) seeds = seeds.concat(user.r3);
    seeds = shuffleArray(seeds);
    const num = Math.ceil(seeds.length / 4);
    let newLimit = Math.floor(50 / num);
    for (let i = 0; i < num; i++) {
      const lim_seeds = seeds.splice(0, 4).join(",");
      const res = await this.#fetchWebApi(token,`v1/recommendations?limit=${newLimit}&seed_artists=${lim_seeds}`,"GET");
      playlist = playlist.concat(res.tracks);
    }
    return playlist;
  }

  async getArtists(token, genres = [], countries = null) {
    let filters = null;
    if (countries) filters = genres.concat(countries);
    else filters = genres;
    const seeds = filters.join(",");
    let result = await this.#fetchWebApi(token,`v1/search?q=%20genre:${seeds}&type=artist&limit=50&offset=3`,"GET");
    if ((await result.artists.items.length) < 5 && filters !== genres) {
      return await this.getArtists(token, genres);
    } else return await result;
  }

  async loadSpotifyHostData() {
    this.#errorCode = this.#params.get("error");
    if (this.#errorCode)document.getElementById("error").innerHTML = "Connection not esthablised correctly.";

    if (this.#code && localStorage.length >= 1) {
      this.#currentUser = {
        token: await this.#getAccessToken(this.#clientId, this.#code),
        timeTokenCreation: Date.now(),
      };

      return await this.getProfile(this.#currentUser.token).then((profile) => {
        profile.token = this.#currentUser.token;
        profile.timeTokenCreation = this.#currentUser.timeTokenCreation;
        return profile;
      });
    }
  }
  
}
