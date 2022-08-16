const express = require("express");
const { Post, User, Comment } = require("../models");
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();

//게시글 생성
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { user } = await res.locals;
    const { title, content, url } = req.body;

    console.log(user, "유저유저")

    if (!content || !title) {
      //content 또는 title 값이 없으면!
      return res.status(400).send({ message: "제목 또는 내용을 작성해주세요." });
    }
    await Post.create({
      userId: user.userId, //user페이지에서 userId를 받아옴
      nickname: user.nickname, //user 페이지에서 nickname을 받아서
      title,
      content,
      url,
    });
    console.log(user.userId, "닉네임확인!")
    console.log(user.nickname, "닉네임확인!")
    res.status(201).json({ data: {
      nickname: user.nickname
    } });
  } catch (error) {
    // console.error(err);
    res.status(400).send({ errorMessage: "error" });
  }
});

//게시글 수정
router.put("/:postId", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, content, url } = req.body;

    const changePost = await Post.findOne({ where: { postId } });

    if (!changePost) {
      return res.status(400).json({ message: "해당 게시글이 없습니다." });
    }

    if(!content){
      return res.status(400).json({ message : "게시글 내용을 작성해주세요."})
    }

    const { user } = await res.locals;
    if (user.nickname !== changePost.nickname) {
      return res.json({ message: "수정 권한이 없습니다." });
    }

    await Post.update({ title, content, url }, { where: { postId } });
    res.status(201).json({ message: "게시글을 수정하였습니다." });
  } catch (error) {
    // console.error(err);
    res.status(400).send({ errorMessage: "error" });
  }
});

//게시글 삭제
router.delete("/:postId", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;

    const findPost = await Post.findOne({ where: { postId } });
    if (!findPost) {
      return res.status(400).json({ message: "해당 게시글이 없습니다." });
    }

    const { user } = await res.locals;
    if (user.nickname !== findPost.nickname) {
      return res.status(400).json({ message: "삭제 권한이 없습니다." });
    }

    const removePost = await Post.destroy({where : {postId}});
    if(removePost) {
        await Comment.destroy({where: {postId: req.params.postId}})
        res.status(200).json({ postId, message: "게시글을 삭제하였습니다."  });
    }
  } catch (error) {
    // console.error(err);
    res.status(400).send({ errorMessage: "error" });
  }
});

module.exports = router;