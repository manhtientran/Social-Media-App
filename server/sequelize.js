import Sequelize from "sequelize";
import config from "./config.js";

const sequelize = new Sequelize(config.postgresUri);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

export default sequelize;
