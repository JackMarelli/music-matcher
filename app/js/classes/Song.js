export default class Song {
  artists;
  id;
  img;
  name;

  constructor(id, img, name) {
    this.artists = [];
    this.id = id;
    this.img = img;
    this.name = name;
  }
}
