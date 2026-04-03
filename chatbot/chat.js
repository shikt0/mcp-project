import cors from "cors";
import express from "express";
import axios from "axios";
import dotenv from "dotenv";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    // 🧠 If user asks about a student → call MCP server
    if (userMessage.toLowerCase().includes("student")) {
      
      // Extract name (very simple logic)
      const words = userMessage.split(" ");
      const name = words[words.length - 1];

      const toolResponse = await axios.post(
        "http://localhost:3000/tool/getStudent",
        { name }
        //sfdhgidhf
      );

      return res.json({
        reply: toolResponse.data
      });
    }

    // 💬 Otherwise → normal LLM chat
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: "You are a helpful AI assistant." },
          { role: "user", content: userMessage }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({
      reply: response.data.choices[0].message.content
    });

  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(4000, () => {
  console.log("Chatbot running on http://localhost:4000");
});