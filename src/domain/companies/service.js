function init({
  companiesRepository,
}) {
  async function listCompanies({
    limit,
    page,
  }) {
    return companiesRepository.listCompanies({
      limit,
      page,
    });
  }

  async function createCompany({
    name,
    isProduction,
    employeesCount,
    averageRate,
  }) {
    return companiesRepository.createCompany({
      name,
      isProduction,
      employeesCount,
      averageRate,
    });
  }

  async function getCompany({
    companyId,
  }) {
    return companiesRepository.getCompany({
      companyId,
    });
  }

  return {
    listCompanies,
    createCompany,
    getCompany,
  };
}

module.exports.init = init;
