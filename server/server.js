// server/server.js

// 1. Load environment variables first
require('dotenv').config();

// 2. Import necessary modules
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const chatbotRoutes = require('./routes/chatbot'); // Import the new route file
// const dotenv = require('dotenv'); // No need to import dotenv again, already handled by require('dotenv').config();

// 3. Initialize Express app
const app = express();
const port = process.env.PORT || 3001; // Use process.env.PORT for flexibility

// 4. Middleware setup
app.use(cors()); // Enable CORS for cross-origin requests
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// 5. Define API Routes

// Email sending route
app.post('/api/send-email', async (req, res) => {
    const { subject, name, email, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'Please provide name, email, and message.' });
    }

    // Create a transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail', // You can use other services or direct SMTP configuration
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // Check if email credentials are loaded
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('Email user or password not loaded from environment variables.');
        return res.status(500).json({ success: false, message: 'Email service not configured correctly.' });
    }
    if (!process.env.DESTINATION_EMAIL) {
        console.error('Destination email not loaded from environment variables.');
        return res.status(500).json({ success: false, message: 'Destination email not configured.' });
    }

    // Email options
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.DESTINATION_EMAIL, // Make sure this is set in your .env
        subject: `${subject || 'New contact form submission'} from ${name}`,
        text: `
            Name: ${name}
            Email: ${email}
            Subject: ${subject || 'N/A'}
            Message: ${message}
        `,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; border: 1px solid #eee; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h2 style="color: #2e7d32; border-bottom: 2px solid #2e7d32; padding-bottom: 10px;">New Contact Form Submission</h2>
                <p style="margin-bottom: 8px;"><strong>Name:</strong> ${name}</p>
                <p style="margin-bottom: 8px;"><strong>Email:</strong> ${email}</p>
                <p style="margin-bottom: 8px;"><strong>Subject:</strong> ${subject || 'N/A'}</p>
                <h3 style="color: #333; margin-top: 20px; margin-bottom: 10px;">Message:</h3>
                <p style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #2e7d32; border-radius: 4px; line-height: 1.6;">${message}</p>
                <p style="color: #777; font-size: 0.9em; margin-top: 20px; text-align: center;">This email was sent from your contact form.</p>
            </div>
        `
    };

    try {
        // Send email
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Failed to send email', error: error.message }); // Send error message to client
    }
});

// Chatbot routes
// Use the chatbot routes for requests starting with /api/chatbot
// This prefixes all routes defined in chatbotRoutes with /api/chatbot
app.use('/api/chatbot', chatbotRoutes);

// Basic root route (optional - useful for checking if the server is running)
// This should be after other specific routes to ensure they are matched first
app.get('/', (req, res) => {
    res.send('Express server is running');
});

// 6. Start the server (ONLY ONE app.listen call)
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
    // Check if Gemini API key is loaded
    console.log(`Gemini API Key: ${process.env.GEMINI_API_KEY ? 'Loaded' : 'NOT LOADED'}`);
    if (!process.env.GEMINI_API_KEY) {
        console.warn('WARNING: GEMINI_API_KEY is not loaded. Chatbot functionality may not work.');
    }
});
