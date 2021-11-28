const moment = require('moment');
const mongoosePaginate = require('mongoose-paginate');

function create(mongoose) {
  const companySchema = mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    isProduction: {
      type: Boolean,
      required: true,
    },
    employeesCount: {
      type: Number,
      required: true,
    },
    averageRate: {
      type: Number,
      required: true,
    },
    created: Date,
  });

  companySchema.pre('save', (next) => {
    this.created = moment().toJSON();
    return next();
  });

  companySchema.index({ created: -1 });

  companySchema.plugin(mongoosePaginate);

  return mongoose.model('Company', companySchema);
}

module.exports = create;
