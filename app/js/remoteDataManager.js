export default class RemoteDataManager {
  #apiRequestURL = "https://api.spotify.com/";
  #clientId = "5d488b4b52a34dfe8ef7a5db254489d2";
  #clientSecret = "ciao"; //RICORDA DI CAMBIARE
  #currentApiToken = null;
  #tokenRequestURL = "https://accounts.spotify.com/api/token";

  constructor() {
    
  }

  #requestToken() {
    return fetch(`${this.#tokenRequestURL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " + btoa(this.#clientId + ":" + this.#clientSecret),
      },
      body: "grant_type=client_credentials",
    })
      .then((response) => {
        if (response.status != "200") {
          throw response.status;
        }
        return response.json();
      })
      .then((data) => {
        console.log({ data });
        return data;
      })
      .catch((err) => { 
        console.error(err);
        alert("Mi spiace, si è verificato un errore, è sicuramente colpa tua.");
      });
  }

  async fetchWebApi(endpoint, method, body) {
    const res = await fetch(`${this.#apiRequestURL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${this.#requestToken()}`, //check se non è già stato chiesto
      },
      method,
      body: JSON.stringify(body),
    });
    return await res.json();
  }
}
