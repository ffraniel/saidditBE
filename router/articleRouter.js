const articleRouter = require('express').Router();
const { allArticles, articleByID, voteArticle } = require('../controller/article');
const { articleComments, postComment } = require ('../controller/comment');

articleRouter.get('/', allArticles);

articleRouter.get('/:article_id', articleByID);

articleRouter.get('/:article_id/comments', articleComments);

articleRouter.post('/:article_id/comments', postComment);

articleRouter.put('/:article_id', voteArticle);

module.exports = articleRouter;