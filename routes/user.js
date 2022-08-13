const express = require("express");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const { User } = require("../models");
const router = express.Router();


// 회원가입
// 유저 정보 확인 후 데이터 베이스에 유저 아이디 생성 API
// 유저 입력 값을 바디를 통해서 받음 ( nickname, password, confirmpassword ) 닉네임 비밀번호 비밀번호 확인

router.post("/signup", async (req, res) => {

    const { nickname, password, confirmPassword } = req.body;

    if (nickname.length < 3) {
        res.status(400).send({
            errorMessage: "닉네임을 확인하세요.",
        });
        return;
    }

    if (password.length < 4 || password.includes(nickname)) {
        res.status(400).send({
            errorMessage: "비밀번호를 확인하세요.",
        });
        return;
    }

    if (password !== confirmPassword) {
        res.status(400).send({
            errorMessage: "비밀번호가 일치하지 않습니다.",
        });
        return;
    }

    const existUsers = await User.findAll({
        where: {
            [Op.or]: [{ nickname }]
        },
    });

    if (existUsers.length) {
        res.status(400).send({
            errorMessage: "이미 가입된 닉네임입니다",
        });
        return;
    }

    await User.create({ nickname, password });

    res.send(201).send({});

});


// 로그인
// 유저 정보 확인 후 데이터 베이스에서 유저 정보 불러오는 API
// 유저 입력 값을 바디를 통해서 받음 ( nickname, password) 닉네임 비밀번호 
// 성공시에 토큰 발급 후에 쿠키에 저장

router.post("/login", async (req, res) => {
    const { nickname, password } = req.body;

    const user = await User.findOne({ where: { nickname, password } });

    if (!user) {
        return res.status(400).send({
            errorMessage: "아이디 또는 패스워드가 잘못됐습니다.",
        });
    }

    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 60);


    const token = jwt.sign({ userId: user.userId }, "secret-key");

    res.cookie('token', token, { expires: expires });

    console.log("로그인 완료");
    return res.status(200).json({ token });
});

// 

module.exports = router;