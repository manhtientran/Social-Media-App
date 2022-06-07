import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

const signin = async (req, res) => {
  try {
    let user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.authenticate(req.body.password)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = jwt.sign({ id: user.id }, config.jwtSecret);
    res.cookie("t", token, { expired: new Date() + 9999 });

    return res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    return res.status(401).json({ message: "Could not sign in" });
  }
};

const signout = (req, res) => {
  res.clearCookie("t");
  return res.status(200).json({ message: "You signed out!" });
};

const requireSignin = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null)
    return res.status(403).json({ message: "Unauthenticated access" });

  jwt.verify(token, config.jwtSecret, (err, user) => {
    if (err) return res.status(403).json({ message: "Unauthenticated access" });
    req.auth = user;
    next();
  });
};

const hasAuthorization = (req, res, next) => {
  const authorized = req.profile && req.auth && req.profile.id == req.auth.id;
  if (!authorized) {
    return res.status(403).json({ message: "Unauthorized access" });
  }
  next();
};

export default { signin, signout, requireSignin, hasAuthorization };
