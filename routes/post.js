const express = require("express")
const { Post } = require("../models")
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
router.post("/", authMiddleware, async (req, res) => {
    const { userId } = res.locals.user
    
    // console.log(userId, "아이디확인")

    const { title, content, url } = req.body;
    console.log(title, "제목확인")
    // console.log(nickname, "닉네임확인")
    console.log(content, "내용확인")
    console.log(url, "주소확인")

    if(!userId) {
        return res.status(400).send({ errorMessage: "접근권한이 없습니다." })
    } else if(!content || !title) {
        return res.send({message: "제목 또는 내용을 작성해주세요."})
    }
    const createPost = await Post.create({
        userId,
        title, 
        content, 
        url
    });
    // console.log(createPost, "작성완료")

    // await createPost.save();

    res.status(201).send({createPost})
})


//게시글 수정



//게시글 삭제


module.exports = router;