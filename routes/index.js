const express = require('express');
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware")

const commentRouter = require('./comment');
const postRouter = require('./post');
const userRouter = require('./user');

router.use('/comments', authMiddleware, commentRouter);
router.use('/posts', postRouter);
router.use('/', userRouter);

module.exports = router;