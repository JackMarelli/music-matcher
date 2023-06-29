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
      
      return await this.#fetchProfile(this.#currentToken)
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
    const verifier = this.#generateCodeVerifier(128);
    const challenge = await this.#generateCodeChallenge(verifier);

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

  #generateCodeVerifier(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
  async #generateCodeChallenge(codeVerifier) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
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

  async #fetchProfile(token) {
    const result = await fetch("https://api.spotify.com/v1/me", {
      method: "GET", 
      headers: { Authorization: `Bearer ${token}` }
    });
    return (await result.json());
  }


 // inutilizzato da rendere universale
  async #sendRequest(token, remoteURL, endPoint, method, body) {
    const result = await fetch(`${remoteURL}${endPoint}`, {
      method: method, 
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(body)
    });
    return (await result.json());
  }

}
