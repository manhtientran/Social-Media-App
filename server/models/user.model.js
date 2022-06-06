import sequelize from "../sequelize.js";
import { Sequelize, DataTypes, Model } from "sequelize";
import crypto from "crypto";

class User extends Model {
  constructor() {
    super();
    this._password = "";
    this.salt = "";
  }

  authenticate(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  }

  encryptPassword(password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (error) {
      return "";
    }
  }

  makeSalt() {
    return Math.round(new Date().valueOf() * Math.random()) + "";
  }
}

User.init(
  {
    // Model attributes are defined here
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      is: /.+\@.+\..+/,
      allowNull: false,
    },
    created: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    updated: Sequelize.DATE,
    hashed_password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    salt: DataTypes.STRING,
    password: {
      type: DataTypes.VIRTUAL,
      validate: {
        is_long_enough() {
          if (this._password.length < 7) {
            throw new Error("Please choose a longer password");
          }
        },

        is_required() {
          if (!this._password) {
            throw new Error("Password is required");
          }
        },
      },

      set(password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(password);
      },
      get() {
        return this._password;
      },
    },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: "User", // We need to choose the model name
  }
);

// the defined model is the class itself
// console.log(User === sequelize.models.User); // true
(async () => {
  await sequelize.sync({ alter: true });
})();

export default User;
