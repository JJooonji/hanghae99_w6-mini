const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const port = 3000;

const router = require("./routes");

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use("/api", router);

// DB에 연결 = sync() 사용으로 DB 모델(./models)의 변화를 감지하여 동기화
const { sequelize } = require("./models");
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("데이터베이스 연결 성공");
  })
  .catch((err) => {
    console.error(err);
  });

app.listen(port, () => {
  console.log(port, "포트로 서버가 연결됨");
});

