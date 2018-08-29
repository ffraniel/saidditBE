const express = require('express');
const apiRouter = express.Router();
const articleRouter = require('./articleRouter');
const commentRouter = require('./commentRouter');
const topicRouter = require('./topicRouter');
const userRouter = require('./userRouter');


apiRouter.get('/', function (req, res) {
  res.send({ status:200 });
});

apiRouter.use('/users', userRouter);

apiRouter.use('/topics', topicRouter);

apiRouter.use('/comments', commentRouter);

apiRouter.use('/articles', articleRouter);

module.exports = apiRouter;