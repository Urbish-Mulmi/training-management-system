// imp file step a.1
// index file for db connection and export this connection
import mongoose from "mongoose";

// Node's default DNS resolver could not resolve MongoDB Atlas SRV records,
// so explicitly use public DNS servers for Atlas connection.
import dns from "dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed");
    console.error(error.message);
  }
};

export default connectDB;