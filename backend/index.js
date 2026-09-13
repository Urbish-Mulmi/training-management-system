
// imp file step a.3
// import connection and app from a.1, a.2 files

// nodemon run this first
// this file must contain connection to database thus it starts up db connection
// and only if connection is established server made in app.js starts

import "dotenv/config";
import app from "./app.js";
import connectDB from "./db/index.js";

const PORT = process.env.PORT || 5000;

console.log("BACKEND_URL:", process.env.BACKEND_URL);
console.log("FRONTEND_URL:", process.env.FRONTEND_URL);
console.log("PORT:", process.env.PORT);

const startServer = async () => {
  try {
    // Connect Database
    await connectDB();

    // Start Express Server ONLY if DB connected
    app.listen(PORT, () => {
      console.log(
        `🚀 Server running on http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error(error.message);
  }
};

startServer();