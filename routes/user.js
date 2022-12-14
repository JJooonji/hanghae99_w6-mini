const express = require("express");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const { User, Post, Comment } = require("../models");
const router = express.Router();

// 회원가입
// 유저 정보 확인 후 데이터 베이스에 유저 아이디 생성 API
// 유저 입력 값을 바디를 통해서 받음 ( nickname, password, confirmpassword ) 닉네임 비밀번호 비밀번호 확인

router.post("/signup", async (req, res) => {
  try {
    const { nickname, password, confirmPassword } = req.body;

    if (nickname.length < 3) {
      return res.status(400).send({
        errorMessage: "닉네임을 확인하세요.",
      });
    }

    if (password.length < 4 || password.includes(nickname)) {
      return res.status(400).send({
        errorMessage: "비밀번호를 확인하세요.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).send({
        errorMessage: "비밀번호가 일치하지 않습니다.",
      });
    }

    const existUsers = await User.findAll({
      where: {
        [Op.or]: { nickname },
      },
    });

    if (existUsers.length) {
      return res.status(400).send({
        errorMessage: "이미 가입된 닉네임입니다",
      });
    }

    await User.create({ nickname, password });
    console.log(`${nickname} 님이 가입하셨습니다.`);

    res.status(201).send({ message: "회원 가입에 성공하였습니다." });
  } catch (error) {
    const message = `${req.method} ${req.originalUrl} : ${error.message}`;
    console.log(message);
    res.status(400).json({ message });
  }
});

// 로그인
// 유저 정보 확인 후 데이터 베이스에서 유저 정보 불러오는 API
// 유저 입력 값을 바디를 통해서 받음 ( nickname, password) 닉네임 비밀번호
// 성공시에 토큰 발급 후에 쿠키에 저장

router.post("/login", async (req, res) => {
  try {
    const { nickname, password } = req.body;

    const user = await User.findOne({ where: { nickname, password } });

    if (!user) {
      res.status(400).send({
        errorMessage: "아이디 또는 패스워드가 잘못됐습니다.",
      });
    }

    // const expires = new Date();
    // expires.setMinutes(expires.getMinutes() + 60);

    const token = jwt.sign({ userId: user.userId }, "secret-key");
    console.log(token);

    // res.send("token", `Bearer ${token}`, {
    //   maxAge: 300000, // 원활한 테스트를 위해 로그인 지속시간을 5분(300초)으로 두었다.
    //   httpOnly: true,
    // });

    // res.cookie("token", token, { expires: expires });

    console.log("로그인 완료");
    res.status(200).json({ token , nickname });
  } catch (error) {
    const message = `${req.method} ${req.originalUrl} : ${error.message}`;
    console.log(message);
    res.status(400).json({ message });
  }
});

// 로그아웃
router.post("/logout", (req, res) => {
  // 쿠키를 지웁니다.
  return res.cookie("token", "").json({ logoutSuccess: true });
});

//게시글 전체 조회
router.get("/", async (req, res) => {
  try {
    const posts = await Post.findAll({
      order: [["updatedAt", "DESC"]], //updatedAt으로 내림차순 정렬
    });
    res.send({ posts });
  } catch (error) {
    const message = `${req.method} ${req.originalUrl} : ${error.message}`;
    console.log(message);
    res.status(400).json({ message });
  }
});

//게시글 상세 조회
router.get("/posts/:postId", async (req, res) => {
    const { postId } = req.params;

  const posts = await Post.findOne({where : {postId}});

  if(!posts) {
    return res.status(400).send({message: "해당 게시글이 없습니다."})
  } 
  res.status(200).json({ posts })
  
})

//댓글 목록 조회 with GET("/api/comments/postId")
router.get("/comments/:postId", async (req, res) => {
	try {
		const {postId} = req.params;
		//postId가 일치하는 게시글을 되도록 날짜 내림차순으로 불러와 찾아봄
		const posts = await Post.findAll({
			where: { postId },
			order: [["updatedAt", "DESC"]],
		});
		//찾았는데 없으면 댓글을 쓸수 없음
		if (!posts.length) {
			return res.status(400).json({ message: "해당 게시글이 없습니다." });
		}
		const allCommentInfo = await Comment.findAll({
			where: { postId },
			order: [["updatedAt", "DESC"]],
		});
		res.json({
			allCommentInfo,
		})		
	}catch(error) {
		const message = `${req.method} ${req.originalUrl} : ${error.message}`;
    console.log(message);
    res.status(400).json({ message });
	}
});

module.exports = router;
