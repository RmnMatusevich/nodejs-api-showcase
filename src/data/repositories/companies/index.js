const errors = require('../../../common/errors');
const mapper = require('../../mapper');
const CompanyDomainModel = require('../../../domain/companies/model');

const DEFAULT_PAGINATION_CONTENT = {
  pagination: {},
  data: [],
};


const handleUsersPaginationResponse = (response) => {
  if (!response.docs || response.docs.length <= 0) {
    return DEFAULT_PAGINATION_CONTENT;
  }
  const companiesList = {
    data: response.docs.map(doc => mapper.toDomainModel(doc, CompanyDomainModel)),
    pagination: {
      total: response.total,
      limit: response.limit,
      page: response.page,
      pages: response.pages,
    },
  };
  return companiesList;
};

const getPaginationOptions = options => ({
  lean: true,
  page: options.page || 1,
  limit: options.limit || 25,
  sort: { created: -1 },
});


const getQueryObject = (options) => {
  const queries = {
    director: options.director,
  };
  return queries;
};


const companyStore = {
  async listCompanies(options) {
    try {
      const { Company: companySchema } = this.getSchemas();
      const docs = await companySchema.paginate(getQueryObject(options), getPaginationOptions(options));
      return handleUsersPaginationResponse(docs);
    } catch (error) {
      throw error;
    }
  },
  async createCompany(options) {
    try {
      const { Company: companySchema } = this.getSchemas();
      const newPost = new companySchema({
        name: options.name,
        isProduction: options.isProduction,
        employeesCount: options.employeesCount,
        averageRate: options.averageRate,
      });
      const doc = await newPost.save();
      return mapper.toDomainModel(doc, CompanyDomainModel);
    } catch (error) {
      throw error;
    }
  },
  async getCompany(options) {
    try {
      const { Company: companySchema } = this.getSchemas();
      const doc = await companySchema.findOne({ _id: options.companyId }).lean().exec();
      if (!doc) {
        throw new errors.NotFound(`Copmany with id ${options.companyId} not found.`);
      }
      return mapper.toDomainModel(doc, CompanyDomainModel);
    } catch (error) {
      throw error;
    }
  },
};


module.exports.init = ({ Company }) => Object.assign(Object.create(companyStore), {
  getSchemas() {
    return {
      Company,
    };
  },
});

