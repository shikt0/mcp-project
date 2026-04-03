import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

async function start() {
  try {
    const client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db("university");
    const students = db.collection("students");

    app.post("/tool/getStudent", async (req, res) => {
      const { name } = req.body;

      const student = await students.findOne({ name });

      res.json({
        content: student || "Student not found"
      });
    });

    app.listen(3000, () => {
      console.log("🚀 MCP Server running on port 3000");
    });

  } catch (err) {
    console.error("❌ Failed to start:", err);
  }
}

start();