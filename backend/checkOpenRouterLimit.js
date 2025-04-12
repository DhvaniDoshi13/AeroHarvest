require("dotenv").config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

(async () => {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/auth/key', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      },
    });

    const data = await response.json();
    console.log("🔑 API Key Info:", data);
  } catch (error) {
    console.error("❌ Error checking OpenRouter key limit:", error);
  }
})();
