const express = require('express');
const EndpointValidator = require('../../middleware/endpointValidator');
const asyncWrapper = require('../../utils/asyncWrapper');

const router = express.Router({ mergeParams: true });


function init({
  companiesService,
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
    console.log(companiesService);
    
    const companiesList = await companiesService.listCompanies(Object.assign(
      options,
      handlePagination({
        page: req.query.page ? parseInt(req.query.page, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit, 10) : 25,
      }),
    ));

    return res.send(companiesList);
  }));

  router.post('/', asyncWrapper(async (req, res) => {
    const newCompany = await companiesService.createCompany({
      name: req.body.name,
      isProduction: req.body.isProduction,
      employeesCount: req.body.employeesCount,
      averageRate: req.body.averageRate,
    });
    return res.send({
      data: newCompany,
    });
  }));

  router.get('/:companyId', asyncWrapper(async (req, res) => {
    const companyDoc = await companiesService.getCompany({
      companyId: req.params.companyId,
    });
    return res.send({
      data: companyDoc,
    });
  }));

  return router;
}


module.exports.init = init;
