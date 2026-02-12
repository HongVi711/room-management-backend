import "reflect-metadata"; 
import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("welcome");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

export default app;
