const express = require('express');
const router = express.Router();

const commentRouter = require('./comment');
const postRouter = require('./post');
const userRouter = require('./user');

router.use('/comments', commentRouter);
router.use('/posts', postRouter);
router.use('/users', userRouter);

module.exports = router;