const jwt = require("jsonwebtoken");

const checkToken = (req, res, next) => {
  const token = req.headers["authorization"].split(" ")[1];
  if (!token) {
    next({ auth: false, message: "No token provided." });
  }
  jwt.verify(token, "SECRET", function (err, decoded) {
    if (err) {
      next({ auth: false, message: "Failed to authenticate token." });
    }
    req.user = decoded;
    next();
  });
};

module.exports = { checkToken };
