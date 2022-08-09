const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (user) => {
  let newUser = new User(user);
  newUser.password = bcrypt.hashSync(user.password, 10);
  try {
    await User.create(newUser);
    newUser.password = undefined;
    return newUser;
  } catch (err) {
    return err.message;
  }
};

const signIn = async (user) => {
  try {
    let foundUser = await User.findOne({
      email: user.email,
    });
    if (!foundUser || !foundUser.comparePassword(user.password)) {
      return {
        message: "Authentication failed. Invalid user or password.",
      };
    }
    return {
      token: jwt.sign(
        { email: foundUser.email, name: foundUser.name, _id: foundUser._id, imgUrl: foundUser.imgUrl },
        "SECRET",
        {
          expiresIn: "24h",
        }
      ),
    };
  } catch (err) {
    return err.message;
  }
};

const checkEmail = async (email) => {
  try {
    let user = await User.findOne({ email: email });
    return user;
  } catch (err) {
    return err.message;
  }
};

module.exports = { registerUser, signIn, checkEmail };
