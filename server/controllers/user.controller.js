import User from "../models/user.model.js";
import lodash from "lodash";

const create = async (req, res) => {
  try {
    const user = await User.create(req.body);
    user.password = undefined;
    user.salt = undefined;
    user.hashed_password = undefined;
    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const list = async (req, res) => {
  try {
    let users = await User.findAll({
      attributes: ["id", "name", "email", "updatedAt", "createdAt"],
    });
    res.json(users);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const userByID = async (req, res, next, id) => {
  try {
    let user = await User.findOne({
      where: {
        id: id,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.profile = user;
    next();
  } catch (error) {
    return res.status(400).json({ message: "Cound not retrieve user" });
  }
};

const read = async (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};
const update = async (req, res) => {
  try {
    let user = req.profile;
    user = lodash.extend(user, req.body);
    user.updatedAt = Date.now();
    await user.save();

    user.password = undefined;
    user.hashed_password = undefined;
    user.salt = undefined;
    return res.json(user);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
const remove = async (req, res) => {
  try {
    let user = req.profile;
    let deletedUser = await User.destroy({ where: { id: user.id } });

    user.password = undefined;
    user.hashed_password = undefined;
    user.salt = undefined;

    return res.json(user);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export default { create, userByID, read, list, remove, update };
