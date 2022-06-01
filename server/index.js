import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import config from "./config.js";
import Sequelize from "sequelize";

const sequelize = new Sequelize(config.postgresUri);

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.listen(config.port, (err) => {
  if (err) {
    console.log(err);
  }
  console.info(`Server is listening on PORT ${config.port}`);
});
export default app;
