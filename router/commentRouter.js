const commentRouter = require('express').Router();
const { voteComment, deleteComment } = require ('../controller/comment');


commentRouter.put('/:comment_id', voteComment);

commentRouter.delete('/:comment_id', deleteComment);

module.exports = commentRouter;