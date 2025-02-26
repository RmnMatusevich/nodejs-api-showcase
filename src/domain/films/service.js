function init({
  filmsRepository,
}) {
  async function listFilms({
    limit,
    page,
    director,
  }) {
    return filmsRepository.listFilms({
      limit,
      page,
      director,
    });
  }

  async function createFilm({
    name,
    director,
    realise,
    time,
  }) {
    return filmsRepository.createFilm({
      name,
      director,
      realise,
      time,
    });
  }

  async function getFilm({
    filmId,
  }) {
    return filmsRepository.getFilm({
      filmId,
    });
  }

  return {
    listFilms,
    createFilm,
    getFilm,
  };
}

module.exports.init = init;
