const Models = require("../models/models");
const Article = Models.Articles;
const mongoose = require("mongoose");
mongoose.Promise = Promise;

function allArticles(req, res, next) {
  Article.find()
    .then(articles => {
      if (articles.length === 0) {
        res.send({
          status: 404,
          message: "No articles available."
        });
      }
      res.send({ articles });
    })
    .catch(err => {
      next(err);
    });
}

function articleByID(req, res, next) {
  const articleID = req.params.article_id;
  Article.find({
    _id: articleID
  })
    .then(article => {
      res.send({
        article: article[0]
      });
    })
    .catch(err => {
      if (err.name === "CastError") {
        return next({
          status: 400,
          message: `The requested topic "${articleID}" is invalid.`,
          error: err
        });
      }
      next(err);
    });
}


function voteArticle(req, res, next) {
  const articleID = req.params.article_id;
  if (req.query.vote !== "up" && req.query.vote !== "down" || !req.query.vote) {
    return next({ status: 400, message: "Unable to process the query. Please provide a query in the format '?query=up' or '?query=down'." });
  }
  const vote = req.query.vote === "up" ? 1 : -1;
  Article.findByIdAndUpdate(
    articleID,
    { $inc: { votes: vote } },
    { new: true }
  )
    .then((article) => {
      return res.status(200).send({ article });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next({
          status:400,
          message:"Invalid article ID"
        });
      }
      return next(err);
    });
}

function topicArticles(req, res, next) {
  const articleTopic = req.params.topic_name;
  Article.find({ belongs_to: articleTopic })
    .then(articles => {
      res.send({ articles });
    })
    .catch(err => {
      if (err.name === "CastError") {
        return next({
          status: 404,
          message: "Invalid Article ID",
          err
        });
      }
      next(err);
    });
}

module.exports = {
  allArticles,
  articleByID,
  voteArticle,
  topicArticles
};