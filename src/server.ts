import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { connectDB } from "./config/db";
// import { seedAdminUser } from "./seeds/admin.seed";

const PORT = process.env.PORT || 3000;

async function startServer() {
  await connectDB();
  // await seedAdminUser();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

startServer();
