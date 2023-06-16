const express = require("express");
const app = express();
const port = 3000;

const connect = require("./schemas");
connect();

app.use(express.json());

const routes = require("./routes");
app.use(routes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(port, "포트로 서버가 열렸어요!");
});
