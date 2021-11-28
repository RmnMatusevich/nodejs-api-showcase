/**
  * This is the app Model it is decoupled from
  * the Entities used for the databse
*/
class Film {
  constructor({ _id, name, director, realise, time, created } = {}) {
    this.id = _id;
    this.name = name;
    this.director = director;
    this.realise = realise;
    this.time = time;
    this.created = created;
  }
}

module.exports = Film;
