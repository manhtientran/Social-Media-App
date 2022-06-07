import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/", userRoutes);
app.use("/", authRoutes);

export default app;
