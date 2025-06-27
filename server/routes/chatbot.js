// server/routes/chatbot.js
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const router = express.Router();

// Access the API key from the server's environment variables
const API_KEY = process.env.GEMINI_API_KEY;

// Check if API_KEY is loaded
if (!API_KEY) {
  console.error("GEMINI_API_KEY not found in server environment variables! Chatbot functionality will be limited.");
  // It's generally better not to exit the process in a web server startup
  // but to log and handle the error gracefully for individual requests.
}

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(API_KEY);

// Define a POST endpoint to handle chatbot requests
router.post('/generate-text', async (req, res) => {
  try {
    // Destructure necessary data from the request body
    // 'userPrompt' is the current message from the user
    // 'chatHistory' is the array of previous messages (user/model turns)
    // 'language' determines the response language
    const { prompt: userPrompt, chatHistory, language } = req.body;

    // Validate input: Ensure a user prompt is provided
    if (!userPrompt) {
      return res.status(400).json({ error: 'Invalid request: "prompt" (user message) is required.' });
    }

    // Define your robust system instructions.
    // This forms the core personality and guidelines for the chatbot.
    const systemInstructions = `You are a specialized mental health assistant for GetActive Kenya.

    Guidelines:
    - Be empathetic and supportive for people with anxiety, depression, and stress.
    - Provide culturally appropriate advice for the Kenyan context.
    - Suggest physical activities and mental health practices based on GetActive Kenya's programs.
    - Never diagnose conditions or replace professional help.
    - Always encourage seeking professional support for serious concerns.
    - Include relevant GetActive Kenya resources when appropriate.
    - Make your responses short and well structured. You may use bullets/ any ordering to order your list.

    ${language === 'sw' ? 'Respond in Swahili.' : 'Respond in English.'}`;

    // Initialize the array that will hold the conversation history
    // This array will be sent to the Gemini API's 'generateContent' method.
    let conversation = [];

    // --- Build the conversation array for the Gemini API ---

    // If it's the very first message in the conversation (no existing chat history),
    // prepend the system instructions to the user's initial prompt.
    // Gemini does not have a separate 'system' role, so context is set this way.
    if (!chatHistory || chatHistory.length === 0) {
      conversation.push({
        role: "user",
        parts: [{ text: `${systemInstructions}\n\nUser: ${userPrompt}` }] // Combine system context and user query
      });
    } else {
      // If there's existing chat history, we assume the system instructions
      // were already included in the very first user turn of that history.
      // We append the previous chat history, ensuring no 'system' roles are included.
      // (The frontend should ideally not send 'system' roles, but this adds a safeguard).
      conversation.push(...chatHistory.filter(msg => msg.role !== 'system'));

      // Then, add the current user's message as the latest turn.
      conversation.push({
        role: "user",
        parts: [{ text: userPrompt }]
      });
    }

    // Get the generative model
    // Using 'gemini-1.5-flash' is often a good balance of speed and capability.
    // If 'gemini-2.0-flash' gave a specific error related to its capabilities,
    // revert to 'gemini-1.0-pro' or 'gemini-1.5-flash' if those are available.
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    // You can try "gemini-1.0-pro" or "gemini-1.5-pro" if this model doesn't work or for different capabilities.

    // Generate content using the model with the prepared conversation
    const result = await model.generateContent({ contents: conversation });

    // Extract the generated text from the response
    const response = await result.response;
    const text = response.text();

    // Send the generated text back to the frontend
    res.json({ text });

  } catch (error) {
    console.error('Error calling Gemini API from backend:', error);

    // Provide more informative error messages based on the API response if possible
    if (error.status && error.statusText) {
      res.status(error.status).json({
        error: `Gemini API Error: ${error.statusText}`,
        details: error.message
      });
    } else {
      res.status(500).json({ error: 'Failed to generate response from AI.', details: error.message });
    }
  }
});

// Export the router to be used in your main server file
module.exports = router;
