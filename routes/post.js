const express = require("express")
const { Post, User } = require("../models")
const authMiddleware = require("../middlewares/auth-middleware")
const router = express.Router();

//게시글 전체 조회
router.get("/", async (req, res) => {
    const posts = await Post.findAll({
        order : [["updatedAt", "DESC"]],//updatedAt으로 내림차순 정렬
    });
    res.send({ posts })
});


//게시글 생성
router.post("/posts", authMiddleware, async (req, res) => {
    const { user } = res.locals
    
    // console.log(user, "아이디확인")

    const { title, content, url } = req.body;

    if(!content || !title) {
        return res.send({message: "제목 또는 내용을 작성해주세요."})
    }
    const createPost = await Post.create({
        userId:user.userId,
        nickname:user.nickname,
        title, 
        content, 
        url
    });

    res.status(201).send({createPost})
})


//게시글 수정



//게시글 삭제


module.exports = router;