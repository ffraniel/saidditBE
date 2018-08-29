const Models = require("../models/models");
const Topic = Models.Topics;
const mongoose = require("mongoose");
mongoose.Promise = Promise;

function allTopics(req, res, next) {
  Topic.find()
    .then(topics => {
      if(topics.length === 0) {
        res.send({
          status:404, message:'No topics available.'
        });
      }
      res.send({
        topics,
        status: 200
      });
    })
    .catch(err => {
      next(err);
    });
}

function topicByName(req, res, next) {
  const topicName = req.params.topic_name;
  Topic.find({
    title:topicName
  })
    .then(topic => {
      if (topic.length === 0) {
        return next({
          status:404, message:`The requested topic "${topicName}" does not have any content.`
        });
      }
      return res.send(topic);
    })
    .catch(err => {
      next(err);
    });
}

module.exports = {
  allTopics,
  topicByName
};