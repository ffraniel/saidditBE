const Models = require("../models/models");
const User = Models.Users;
const mongoose = require("mongoose");
mongoose.Promise = Promise;

function getUser(req, res, next) {
  const user = req.params.username;
  User.find({ username: user })
    .then(users => {
      if (users.length === 0) {
        return res.status(404).send({
          message:"No user found by this ID."
        });
      }
      res.send({ users });
    })
    .catch(err => {
      next(err);
    });
}

function getAllUsers(req, res, next) {
  User.find()
    .then(users => {
      res.send({ users });
    })
    .catch(err => {
      next(err);
    });
}

module.exports = {
  getUser,
  getAllUsers
};