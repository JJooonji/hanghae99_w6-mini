const jwt = require("jsonwebtoken");
const { User } = require("../models");

module.exports = (req, res, next) => {
  const { token } = req.cookies;
  console.log(token);

  if (!token) {
    res.status(401).send({
      errorMessage: "로그인 후 사용하세요.(1) 토큰 없음",
    });
    return;
  }

  try {
    const { userId } = jwt.verify(token, "secret-key");

    User.findByPk(userId).then((user) => {
        console.log(user);
      res.locals.user = user;
      next();
    });
  } catch (error) {
    res.status(401).send({
      errorMessage: "로그인 후 사용하세요.(2) 토큰 검증 불가",
    });
    return;
  }
};
