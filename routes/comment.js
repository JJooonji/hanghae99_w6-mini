const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware")
const { Comment } = require("../models");
const { Post } = require("../models");


//api 시작
//댓글 작성 api with post('/api/comments/postId')
router.post("/:postId", authMiddleware, async(req, res) => {
    try{
        const { postId } = req.params; //_postId를 사용하겠다고 변수선언
        //request body 에 적힌 변수들을 기록해둡니다.
        const { comment } = req.body;

        //body에 입력 받은 수정할 댓들이 없으면 수정할수 없습니다.
        if (!comment) {
            return res.status(400).json({ message: "댓글 내용을 작성해 주세요." });
        }
        //_postId와 일치하는 데이터를 DB에서 모두 찾습니다.
        const posts = await Post.findAll({ where: { postId }});
        
        if(!posts) {
            return res.status(400).json({message: "해당 게시글이 없습니다."});
        }
        //미들웨어를 거쳐 인증된 사용자 객체 user: 사용자 정보를 모두 담고 있음
        const { user } = await res.locals;
        //이 comment는 postId "게시글" 에남겨지는 '댓글'입니다.
        const creatComment = await Comment.create({
            postId,
            userId: user.userId,
            nickname: user.nickname,
            comment
        });

        res.status(201).json({ data: { 
			nickname:user.nickname,
			userId:user.userId,
			postId, 
			comment, 
			commentId:creatComment.commentId,
			createdAt:creatComment.createdAt,
			updatedAt:creatComment.updatedAt
	}, 
			message: "댓글이 생성되었습니다." });

    } catch(error) {
        const message = `${req.method} ${req.originalUrl} : ${error.message}`;
        console.log(message);
        res.status(400).json({ message });
    }   
	
});

// //댓글 목록 조회 with GET("/api/comments/postId")
// router.get("/:postId", async (req, res) => {
// 	try {
// 		const {postId} = req.params;
// 		//postId가 일치하는 게시글을 되도록 날짜 내림차순으로 불러와 찾아봄
// 		const posts = await Post.findAll({
// 			where: { postId },
// 			order: [["updatedAt", "DESC"]],
// 		});
// 		//찾았는데 없으면 댓글을 쓸수 없음
// 		if (!posts.length) {
// 			return res.status(400).json({ message: "해당 게시글이 없습니다." });
// 		}
// 		const allCommentInfo = await Comment.findAll({
// 			where: { postId },
// 			order: [["updatedAt", "DESC"]],
// 		});
// 		res.json({
// 			allCommentInfo,
// 		})		
// 	}catch(error) {
// 		const message = `${req.method} ${req.originalUrl} : ${error.message}`;
//     console.log(message);
//     res.status(400).json({ message });
// 	}
// });
//댓글 수정 api with put ('api/comments/_commentId')
router.put("/:commentId", authMiddleware, async (req,res) => {
	try{
		const {commentId} = req.params;

		const {comment} = req.body;

		const comments = await Comment.findOne({ where: { commentId } });
		//댓글이 없으면 수정 안됨
		if(!comment) {
			res.status(400).json({message: "댓글 내용을 작성해주세요."});
		}
		//미들웨어를 통해서 댓글 작성자인지 확인함
		const { user } = await res.locals;
		if(user.nickname != comments.nickname) {
			return res.status(400).json({message: "수정 권한이 없습니다."});
		}
		//해당 댓글을 업데이트 합니다.
		await Comment.update(
			{comment},
			{
				where: {
					commentId
				},
			}
			);
			//수정이 끝났으므로 메세지를 res함
			res.status(201).json({message: "댓글을 수정하였습니다."});
	}catch(error) {
		const message = `${req.method} ${req.originalUrl} : ${error.message}`;
    console.log(message);
    res.status(400).json({ message });
	}
});
//댓글 삭제 API with delete ("/api/comment")
router.delete("/:commentId", authMiddleware, async (req, res) => {
	try{
		const { commentId } = req.params;

		const comments = await Comment.findOne({ where: { commentId } });
		//찾은게 없으면 삭제할수 없음.
		if (!comments) {
			return res.status(400).json({ message: "해당 댓글이 없습니다."});
		}
		//미들웨어로 사용자 인증
		const { user } = await res.locals;

		if (user.nickname != comments.nickname) {
			res.json({message: "삭제 권한이 없습니다."})
		}else {
			await Comment.destroy({where: {commentId}});
			return res.status(200).json({message: "댓글을 삭제하였습니다."});
		}		
	}catch(error) {
		const message = `${req.method} ${req.originalUrl} : ${error.message}`;
    console.log(message);
    res.status(400).json({ message });
	}
});

module.exports = router;