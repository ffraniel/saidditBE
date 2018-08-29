const Models = require("../models/models");
const Comment = Models.Comments;
const mongoose = require("mongoose");
mongoose.Promise = Promise;

function articleComments(req, res, next) {
  const articleID = req.params.article_id;
  Comment.find({
    belongs_to: articleID
  })
    .then(comments => {
      if (comments.length === 0) {
        return res.status(404).send({
          message: `The requested article "${articleID}" does not have any comments.`
        });
      }
      return res.send({
        comments
      });
    })
    .catch(err => {
      if (err.name === "CastError") {
        return next({
          status: 400,
          message: `The requested article "${articleID}" does not have any comments.`,
          error: err
        });
      }
      next(err);
    });
}

function postComment(req, res) {
  const articleID = req.params.article_id;
  const postedComment = {
    body: req.body.comment,
    belongs_to: articleID,
    created_by: req.body.created_by
  };
  new Comment(postedComment)
    .save()
    .then(comment => {
      return res.send({
        comment
      });
    })
    .catch(err => {
      return res.status(400).send({
        message: `The article ID "${articleID}" was not found. We were unable to post your comment, "${
          postedComment.body
        }"`,
        error: err
      });
    });
}

function voteComment(req, res, next) {
  const commentID = req.params.comment_id;
  let vote;
  let valid = false;
  if (req.query.vote === "up") {
    vote = 1;
    valid = true;
  }
  if (req.query.vote === "down") {
    vote = -1;
    valid = true;
  }
  if (valid === false) {
    vote = 0;
  }

  Comment.update(
    {
      _id: commentID
    },
    {
      $inc: {
        votes: vote
      }
    }
  )
    .then(com => {
      if (com.ok === 1 && com.nModified === 1 && com.n === 1) {
        Comment.find({
          _id: commentID
        }).then(comment => {
          res.send({
            comment
          });
        });
      } else if (com.ok === 1 && com.nModified === 0 && com.n === 1) {
        return res.status(400).send({
          message:
            "Unable to process the query. Please provide a query in the format '?query=up' or '?query=down'."
        });
      }
    })
    .catch(err => {
      if (err.name === "CastError") {
        return next({
          status: 404,
          message: `The requested comment "${commentID}" does not exist.`,
          error: err
        });
      }
      next(err);
    });
}

function deleteComment(req, res, next) {
  const commentID = req.params.comment_id;
  Comment.find({
    _id: commentID
  })
    .then(comments => {
      if (comments[0].created_by === "northcoder") {
        Comment.deleteOne({
          _id: commentID
        })
          .then(() => {
            return res.status(200).send({
              message: `Comment "${commentID}" was deleted.`,
              comment: comments[0]
            });
          });
      } else {
        return res.status(403).send({
          message: `You do not have permission to delete the comment with ID "${commentID}".`,
          error: {
            name: "ValidationError"
          }
        });
      }
    })
    .catch(err => {
      if (err.name === "CastError") {
        return res.status(404).send({
          message: "The comment you are trying to delete does not exist.",
          error: err
        });
      }
      if (err.name === "ReferenceError") {
        return res.status(500).send({
          message: "ReferenceError",
          error: err
        });
      } else {
        next();
      }
    });
}

module.exports = {
  articleComments,
  postComment,
  voteComment,
  deleteComment
};