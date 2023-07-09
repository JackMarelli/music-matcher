export default class Playlist {
  songs;

  constructor() {
    this.songs = [];
  }

  getSong(id) {
    return this.songs.find((song) => {
      return song.id === id;
    });
  }

  removeSong(id) {
    this.songs = this.songs.filter((song) => song.id !== id);
    this.saveToLocalStorage();
  }

  addSong(song) {
    this.songs.push(song);
  }

  addSongAndSaveLocal() {
    this.songs.push(song);
    this.saveToLocalStorage();
  }

  saveToLocalStorage() {
    localStorage.playlist = JSON.stringify(this);
  }

  cleanFromLocalStorage() {
    localStorage.removeItem("playlist");
    return this.songs;
  }
}
