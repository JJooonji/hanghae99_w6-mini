const express = require("express")
const { Post, User } = require("../models")
const authMiddleware = require("../middlewares/auth-middleware")
const router = express.Router();

//게시글 생성
router.post("/", authMiddleware, async (req, res) => {
    const { user } = res.locals

    const { title, content, url } = req.body; //title, content, url r값만 입력

    if(!content || !title) {//content 또는 title 값이 없으면!
        return res.send({message: "제목 또는 내용을 작성해주세요."})
    }
    const createPost = await Post.create({
        userId:user.userId,//user페이지에서 userId를 받아옴
        nickname:user.nickname,//user 페이지에서 nickname을 받아서
        title, 
        content, 
        url
    });

    res.status(201).send({createPost})
})


//게시글 수정



//게시글 삭제


module.exports = router;

