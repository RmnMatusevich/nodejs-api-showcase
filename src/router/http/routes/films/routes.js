const express = require('express');
const EndpointValidator = require('../../middleware/endpointValidator');
const asyncWrapper = require('../../utils/asyncWrapper');

const endpointValidator = new EndpointValidator();
const router = express.Router({ mergeParams: true });


function init({
  filmsService,
}) {
  const DEFAULT_PAGINATION_LIMIT = 25;
  const MAX_PAGINATION_LIMIT = 100;
  const DEFAULT_PAGINATION_PAGE = 1;

  const handlePagination = (options) => {
    const populateOptionsWithPagination = Object.assign({}, options);
    if (isNaN(populateOptionsWithPagination.limit)) {
      populateOptionsWithPagination.limit = DEFAULT_PAGINATION_LIMIT;
    }
    if (isNaN(populateOptionsWithPagination.page)) {
      populateOptionsWithPagination.page = DEFAULT_PAGINATION_PAGE;
    }
    if (populateOptionsWithPagination.limit > MAX_PAGINATION_LIMIT) {
      populateOptionsWithPagination.limit = MAX_PAGINATION_LIMIT;
    }
    return populateOptionsWithPagination;
  };

  router.get('/', asyncWrapper(async (req, res) => {    
    const options = req.query;
    
    const filmsList = await filmsService.listFilms(Object.assign(
      options,
      handlePagination({
        page: req.query.page ? parseInt(req.query.page, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit, 10) : 25,
      }),
    ));
    
    return res.send(filmsList);
  }));

  router.post('/', asyncWrapper(async (req, res) => {
    const newFilm = await filmsService.createFilm({
      name: req.body.name,
      director: req.body.director,
      realise: req.body.realise,
      time: req.body.time,
    });
    return res.send({
      data: newFilm,
    });
  }));

  router.get('/:filmId', asyncWrapper(async (req, res) => {
    const filmDoc = await filmsService.getFilm({
      filmId: req.params.filmId,
    });
    return res.send({
      data: filmDoc,
    });
  }));

  return router;
}


module.exports.init = init;
