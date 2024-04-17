const mongoose = require("mongoose");
require("dotenv").config(); 

const uri = process.env.MONGODB_URI;
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
  coins: { type: Number },
  skins: [Boolean],
});

const User = new mongoose.model("User", UserSchema);

const getTopUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ score: -1 }).limit(10);
    res.json(users);
    return users;
  } catch (error) {
    return res.status(500).json({ error: error });
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
    return res.status(500).json({ error: error });
  }
};

const updateScore = async (req, res) => {
  const { username, score, coins } = req.body;
  try {
    const user = await User.findOne({ username });

    if (!user) {
      const user = new User({
        username,
        score: 0,
        coins: 100,
        skins: [true, false, false, false],
      });
      await user.save();
      return res.json(user);
    }

    if (!user.coins) {
      user.coins = coins;
    } else {
      user.coins = user.coins + coins;
    }

    if (score <= user.score) {
      await user.save();
      return res.json({
        message: "Score must be greater than current score",
        user,
      });
    }
    user.score = score;
    await user.save();
    res.json(user);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

const buySkin = async (req, res) => {
  const { username, skinId } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send("User not found");
    }
    if (user.coins < 100) {
      return res.status(400).send("Not enough coins");
    }
    user.coins = user.coins - 100;
    user.skins[skinId] = true;
    await user.save();
    res.json(user);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

module.exports = {
  UserSchema,
  getTopUsers,
  updateScore,
  getUserScore,
  buySkin,
  uri,
  clientOptions,
  run,
};
