const postSchema = require('./Post');
const userSchema = require('./User');
const filmSchema = require('./Film');
const companySchema = require('./Company');

module.exports.create = mongoose => ({
  Post: postSchema(mongoose),
  User: userSchema(mongoose),
  Film: filmSchema(mongoose),
  Company: companySchema(mongoose),
});
