const mongoose = require("mongoose");
const uri =
  "mongodb+srv://bachxoai:2212@bachxoai-cluster.a8vn8ny.mongodb.net/racing-db";
const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};

async function run() {
  try {
    await mongoose.connect(uri, clientOptions);
    console.log("Connect successfully!!!");
  } catch (error) {
    console.log("Connect failure!!! \n Error:" + error);
  }
}

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  score: { type: Number },
});

const User = new mongoose.model("User", UserSchema);

const getTopUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ score: -1 }).limit(10);
    res.json(users);
    return users;
  } catch (error) {
    return res.status(500).send("Error: " + error);
  }
};

const getUserScore = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.json(user);
  } catch (error) {
    return res.status(500).send("Error: " + error);
  }
};

const updateScore = async (req, res) => {
  const { username, score } = req.body;
  try {
    const user = await User.findOne({ username });

    if (!user) {
      const user = new User({ username, score });
      await user.save();
      res.json(user);
    }

    if (score <= user.score) {
      return res.status(400).json("Score must be greater than current score");
    }
    user.score = score;
    await user.save();
    res.json(user);
  } catch (error) {
    return res.status(500).send("Error: " + error);
  }
};

module.exports = {
  UserSchema,
  getTopUsers,
  updateScore,
  getUserScore,
  uri,
  clientOptions,
  run,
};
