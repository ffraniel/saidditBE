const userRouter = require('express').Router();
const { getUser, getAllUsers } = require ('../controller/user');

userRouter.get('/:username', getUser);

userRouter.get('/', getAllUsers);

module.exports = userRouter;