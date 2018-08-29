const topicRouter = require('express').Router();
const { allTopics, topicByName } = require('../controller/topic');
const { topicArticles } = require('../controller/article');

topicRouter.get('/', allTopics);

topicRouter.get('/:topic_name', topicByName);

topicRouter.get('/:topic_name/articles', topicArticles);

module.exports = topicRouter;