require("dotenv").config();
const express = require("express");
const axios = require("axios");
const router = express.Router();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

router.post("/", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo", // or another model available on OpenRouter
        messages: [ {
            role: "system",
            content: "You are a helpful assistant that gives answers specifically relevant to India. Use Indian names, examples, prices in INR, and local context where appropriate.",
          },{ 
            role: "user", 
            content: message }],
      },
      {
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply = response.data.choices?.[0]?.message?.content || "I couldn't understand that.";
    res.json({ reply });
  } catch (error) {
    console.error("❌ OpenRouter API error:", error.response?.data || error.message);
    res.status(500).json({ reply: "Sorry, something went wrong." });
  }
});

module.exports = router;
