const moment = require('moment');
const mongoosePaginate = require('mongoose-paginate');

function create(mongoose) {
  const filmSchema = mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    director: {
      type: String,
      required: true,
    },
    realise: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    created: Date,
  });

  filmSchema.pre('save', (next) => {
    this.created = moment().toJSON();
    return next();
  });

  filmSchema.index({ created: -1 });

  filmSchema.plugin(mongoosePaginate);

  return mongoose.model('Film', filmSchema);
}

module.exports = create;
