var jwt = require("jsonwebtoken");
const jwt_secret = "thisisasecret";

const fetchuser = (req, res, next) => {
  //get the user from jwt token and id to req object
  const token = req.header("auth-token");

  if (!token) {
    res.status(401).send({ error: "please authenticate using valid token" });
  }
  try {
    const data = jwt.verify(token, jwt_secret);
    req.user = data.user;

    next();
  } catch (error) {
    res.status(401).send({ error: "please authenticate using valid token" });
  }
};

module.exports = fetchuser;
