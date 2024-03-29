const express = require("express");
const { getTopUsers, createUser, updateScore, run } = require("./mongoose");
const app = express();
const cors = require("cors");
const port = 3000;

run();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

//body parser
app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.get("/user", getTopUsers);
app.post("/user", createUser);
app.put("/user", updateScore);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

module.exports = app;
