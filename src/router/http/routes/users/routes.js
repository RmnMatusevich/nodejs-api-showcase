const express = require('express');
const EndpointValidator = require('../../middleware/endpointValidator');
const asyncWrapper = require('../../utils/asyncWrapper');
const {
  toResponseModel,
} = require('../users/mapper');
const postsRouter = require('../posts/routes');
const filmsRouter = require('../films/routes');

const endpointValidator = new EndpointValidator();
const router = express.Router({ mergeParams: true });

function init({ usersService, postsService, filmsService }) {
  router.get('/:userId',
    // endpointValidator.requireSameUser,
    asyncWrapper(async (req, res) => {
      const result = await usersService.getUser({
        userId: req.params.userId,
      });
      return res.send({
        data: Object.assign({},
          toResponseModel(result.user),
          { posts: result.posts }),
      });
    }));
  router.use('/:userId/posts', postsRouter.init({
    postsService,
  }));
  router.use('/films', filmsRouter.init({
    filmsService,
  }));
  return router;
}

module.exports.init = init;
