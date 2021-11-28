const errors = require('../../../common/errors');
const mapper = require('../../mapper');
const FilmDomainModel = require('../../../domain/films/model');

const DEFAULT_PAGINATION_CONTENT = {
  pagination: {},
  data: [],
};


const handleUsersPaginationResponse = (response) => {
  if (!response.docs || response.docs.length <= 0) {
    return DEFAULT_PAGINATION_CONTENT;
  }
  const postsList = {
    data: response.docs.map(doc => mapper.toDomainModel(doc, FilmDomainModel)),
    pagination: {
      total: response.total,
      limit: response.limit,
      page: response.page,
      pages: response.pages,
    },
  };
  return postsList;
};

const getPaginationOptions = options => ({
  lean: true,
  page: options.page || 1,
  limit: options.limit || 25,
  sort: { time: 1 },
});


const getQueryObject = (options) => {
  const queries = {
    director: options.director,
  };
  return queries;
};


const filmStore = {
  async listFilms(options) {
    try {
      const { Film: filmSchema } = this.getSchemas();
      const docs = await filmSchema.paginate(getQueryObject(options), getPaginationOptions(options));
      return handleUsersPaginationResponse(docs);
    } catch (error) {
      throw error;
    }
  },
  async createFilm(options) {
    try {
      const { Film: filmSchema } = this.getSchemas();
      const newPost = new filmSchema({
        name: options.name,
        director: options.director,
        realise: options.realise,
        time: options.time,
      });
      const doc = await newPost.save();
      return mapper.toDomainModel(doc, FilmDomainModel);
    } catch (error) {
      throw error;
    }
  },
  async getFilm(options) {
    try {
      const { Film: filmSchema } = this.getSchemas();
      const doc = await filmSchema.findOne({ _id: options.filmId }).lean().exec();
      if (!doc) {
        throw new errors.NotFound(`Post with id ${options.postId} not found.`);
      }
      return mapper.toDomainModel(doc, FilmDomainModel);
    } catch (error) {
      throw error;
    }
  },
};


module.exports.init = ({ Film }) => Object.assign(Object.create(filmStore), {
  getSchemas() {
    return {
      Film,
    };
  },
});

