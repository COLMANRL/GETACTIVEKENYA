// server/server.js

// 1. Load environment variables first
require('dotenv').config();

// 2. Import necessary modules
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const chatbotRoutes = require('./routes/chatbot'); // Import the existing chatbot route file

// 3. Initialize Express app
const app = express();
const port = process.env.PORT || 3001; // Use process.env.PORT for flexibility

// 4. Middleware setup
app.use(cors()); // Enable CORS for cross-origin requests
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// 5. Email transporter setup (reusable for both contact and booking)
const createTransporter = async () => {
    const transporter = nodemailer.createTransport({ // <-- Corrected line
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    return transporter;
};

// 6. Google Calendar setup (optional for bookings)
const setupGoogleCalendar = () => {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
        return null;
    }

    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN
    });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    return calendar;
};

// 7. Google OAuth Setup for getting refresh tokens
const createOAuth2Client = () => {
    return new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI || `http://localhost:${port}/auth/google/callback`
    );
};

// 8. Define API Routes

// NEW: Google OAuth initiation route
app.get('/auth/google', (req, res) => {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
        return res.status(500).json({
            error: 'Google OAuth not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env file.'
        });
    }

    const oauth2Client = createOAuth2Client();

    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: [
            'https://www.googleapis.com/auth/calendar',
            'https://www.googleapis.com/auth/calendar.events'
        ]
    });

    res.redirect(authUrl);
});

// NEW: Google OAuth callback route
app.get('/auth/google/callback', async (req, res) => {
    const { code, error } = req.query;

    if (error) {
        return res.status(400).send(`
            <div style="font-family: Arial, sans-serif; padding: 40px; text-align: center;">
                <h1 style="color: #d32f2f;">OAuth Error</h1>
                <p>Error: ${error}</p>
                <a href="/" style="color: #2e7d32;">Go back to home</a>
            </div>
        `);
    }

    if (!code) {
        return res.status(400).send(`
            <div style="font-family: Arial, sans-serif; padding: 40px; text-align: center;">
                <h1 style="color: #d32f2f;">Missing Authorization Code</h1>
                <p>No authorization code received from Google.</p>
                <a href="/auth/google" style="color: #2e7d32;">Try again</a>
            </div>
        `);
    }

    try {
        const oauth2Client = createOAuth2Client();

        // Exchange authorization code for tokens
        const { tokens } = await oauth2Client.getToken(code);

        res.send(`
            <div style="font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto;">
                <h1 style="color: #2e7d32;">✅ Google Calendar Authorization Successful!</h1>

                <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h2>Your Refresh Token:</h2>
                    <p style="background-color: #e8f5e8; padding: 15px; border-radius: 4px; font-family: monospace; word-break: break-all; border-left: 4px solid #2e7d32;">
                        ${tokens.refresh_token || 'No refresh token received (you may already have one)'}
                    </p>
                </div>

                ${tokens.refresh_token ? `
                    <div style="background-color: #fff3cd; padding: 15px; border-radius: 4px; border-left: 4px solid #ffc107; margin: 20px 0;">
                        <h3>📝 Next Steps:</h3>
                        <ol>
                            <li>Copy the refresh token above</li>
                            <li>Add it to your .env file as: <code>GOOGLE_REFRESH_TOKEN=your_token_here</code></li>
                            <li>Restart your server</li>
                            <li>Your Google Calendar integration will now work!</li>
                        </ol>
                    </div>
                ` : `
                    <div style="background-color: #d1ecf1; padding: 15px; border-radius: 4px; border-left: 4px solid #bee5eb; margin: 20px 0;">
                        <h3>ℹ️ No New Refresh Token</h3>
                        <p>You may already have a valid refresh token. Check your .env file for GOOGLE_REFRESH_TOKEN.</p>
                        <p>If you need a new one, revoke access in your <a href="https://myaccount.google.com/permissions" target="_blank">Google Account permissions</a> and try again.</p>
                    </div>
                `}

                <div style="margin-top: 30px;">
                    <h3>All Token Information:</h3>
                    <pre style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; overflow-x: auto; font-size: 12px;">
${JSON.stringify(tokens, null, 2)}
                    </pre>
                </div>

                <p style="margin-top: 30px;">
                    <a href="/" style="color: #2e7d32; text-decoration: none; background-color: #e8f5e8; padding: 10px 20px; border-radius: 4px;">← Back to Home</a>
                </p>
            </div>
        `);

    } catch (error) {
        console.error('Error exchanging code for tokens:', error);
        res.status(500).send(`
            <div style="font-family: Arial, sans-serif; padding: 40px; text-align: center;">
                <h1 style="color: #d32f2f;">Token Exchange Error</h1>
                <p>Failed to exchange authorization code for tokens.</p>
                <p style="color: #666;">Error: ${error.message}</p>
                <a href="/auth/google" style="color: #2e7d32;">Try again</a>
            </div>
        `);
    }
});

// Existing Email sending route (for contact form)
app.post('/api/send-email', async (req, res) => {
    const { subject, name, email, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'Please provide name, email, and message.' });
    }

    // Check if email credentials are loaded
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('Email user or password not loaded from environment variables.');
        return res.status(500).json({ success: false, message: 'Email service not configured correctly.' });
    }
    if (!process.env.DESTINATION_EMAIL) {
        console.error('Destination email not loaded from environment variables.');
        return res.status(500).json({ success: false, message: 'Destination email not configured.' });
    }

    try {
        const transporter = await createTransporter();

        // Email options
        const mailOptions = {
            from: `"Wellness Therapy Contact Form" <${process.env.EMAIL_USER}>`,
            to: process.env.DESTINATION_EMAIL,
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

        // Send email
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Failed to send email', error: error.message });
    }
});

// New Booking endpoint
app.post('/api/bookings', async (req, res) => {
    try {
        const { fullName, email, sessionType, preferredDate, phone, message } = req.body;

        // Validate required fields
        if (!fullName || !email || !sessionType || !preferredDate) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in all required fields (Name, Email, Session Type, and Preferred Date).'
            });
        }

        // Check if email credentials are loaded
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.error('Email user or password not loaded from environment variables.');
            return res.status(500).json({ success: false, message: 'Email service not configured correctly.' });
        }

        // Send email notification
        const transporter = await createTransporter();

        // Email to admin/therapist
        const adminEmailOptions = {
          from: `"New Booking (Wellness Therapy)" <${process.env.EMAIL_USER}>`,
            to: process.env.ADMIN_EMAIL || process.env.DESTINATION_EMAIL || process.env.EMAIL_USER,
            subject: `New Therapy Booking Request - ${sessionType}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; border: 1px solid #eee; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <h2 style="color: #2e7d32; border-bottom: 2px solid #2e7d32; padding-bottom: 10px;">New Booking Request</h2>
                    <p><strong>Client Details:</strong></p>
                    <ul style="list-style: none; padding: 0;">
                        <li style="margin-bottom: 8px;"><strong>Name:</strong> ${fullName}</li>
                        <li style="margin-bottom: 8px;"><strong>Email:</strong> ${email}</li>
                        <li style="margin-bottom: 8px;"><strong>Phone:</strong> ${phone || 'Not provided'}</li>
                        <li style="margin-bottom: 8px;"><strong>Session Type:</strong> ${sessionType}</li>
                        <li style="margin-bottom: 8px;"><strong>Preferred Date:</strong> ${preferredDate}</li>
                    </ul>
                    ${message ? `
                        <h3 style="color: #333; margin-top: 20px; margin-bottom: 10px;">Additional Message:</h3>
                        <p style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #2e7d32; border-radius: 4px; line-height: 1.6;">${message}</p>
                    ` : ''}
                    <p style="color: #777; font-size: 0.9em; margin-top: 20px;"><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
                </div>
            `
        };

        // Confirmation email to client
        const clientEmailOptions = {
            from: `"Wellness Therapy" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Booking Request Received - Wellness Therapy',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; border: 1px solid #eee; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <h2 style="color: #2e7d32; border-bottom: 2px solid #2e7d32; padding-bottom: 10px;">Thank you for your booking request!</h2>
                    <p>Dear ${fullName},</p>
                    <p>We have received your booking request for a <strong>${sessionType}</strong> session on <strong>${preferredDate}</strong>.</p>
                    <p>Our team will review your request and contact you within 24 hours to confirm your appointment and provide further details.</p>

                    <h3 style="color: #333; margin-top: 20px; margin-bottom: 10px;">Your Booking Details:</h3>
                    <ul style="list-style: none; padding: 0; background-color: #f9f9f9; padding: 15px; border-radius: 4px;">
                        <li style="margin-bottom: 8px;"><strong>Session Type:</strong> ${sessionType}</li>
                        <li style="margin-bottom: 8px;"><strong>Preferred Date:</strong> ${preferredDate}</li>
                        <li style="margin-bottom: 8px;"><strong>Phone:</strong> ${phone || 'Not provided'}</li>
                    </ul>

                    ${message ? `<p><strong>Your Message:</strong> ${message}</p>` : ''}

                    <p>If you need to make any changes or have questions, please reply to this email.</p>
                    <p style="margin-top: 30px;">Best regards,<br><strong>The Wellness Therapy Team</strong></p>
                </div>
            `
        };

        // Send emails
        await transporter.sendMail(adminEmailOptions);
        await transporter.sendMail(clientEmailOptions);

        // Optional: Add to Google Calendar
        try {
            if (process.env.GOOGLE_CALENDAR_ID) {
                const calendar = setupGoogleCalendar();

                if (calendar) {
                    const event = {
                        summary: `${sessionType} - ${fullName}`,
                        description: `
                            Client: ${fullName}
                            Email: ${email}
                            Phone: ${phone || 'Not provided'}
                            Session: ${sessionType}
                            Message: ${message || 'None'}
                        `,
                        start: {
                            date: preferredDate,
                        },
                        end: {
                            date: preferredDate,
                        },
                        attendees: [
                            { email: email }
                        ]
                    };

                    await calendar.events.insert({
                        calendarId: process.env.GOOGLE_CALENDAR_ID,
                        resource: event,
                    });
                    console.log('Event added to Google Calendar successfully');
                }
            }
        } catch (calendarError) {
            console.error('Calendar error (non-critical):', calendarError);
            // Don't fail the booking if calendar fails
        }

        res.status(200).json({
            success: true,
            message: 'Booking request sent successfully! You will receive a confirmation email shortly.'
        });

    } catch (error) {
        console.error('Booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process booking. Please try again later.',
            error: error.message
        });
    }
});

// Existing Chatbot routes
// Use the chatbot routes for requests starting with /api/chatbot
app.use('/api/chatbot', chatbotRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'Server is running',
        timestamp: new Date().toISOString(),
        port: port
    });
});

// Basic root route (optional - useful for checking if the server is running)
app.get('/', (req, res) => {
    res.send(`
        <div style="font-family: Arial, sans-serif; padding: 40px; text-align: center;">
            <h1 style="color: #2e7d32;">Wellness Therapy Server</h1>
            <p>Express server is running successfully!</p>
            <p style="color: #666;">Available endpoints:</p>
            <ul style="list-style: none; padding: 0;">
                <li>POST /api/send-email - Contact form</li>
                <li>POST /api/bookings - Therapy bookings</li>
                <li>/api/chatbot - Chatbot functionality</li>
                <li>GET /api/health - Health check</li>
                <li style="color: #2e7d32; font-weight: bold;">GET /auth/google - Setup Google Calendar (Get Refresh Token)</li>
            </ul>

            ${!process.env.GOOGLE_REFRESH_TOKEN ? `
                <div style="background-color: #fff3cd; padding: 15px; border-radius: 4px; margin: 20px auto; max-width: 500px; border-left: 4px solid #ffc107;">
                    <h3>📅 Google Calendar Setup Needed</h3>
                    <p>To enable Google Calendar integration:</p>
                    <a href="/auth/google" style="background-color: #4285f4; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block; margin-top: 10px;">
                        🔗 Connect Google Calendar
                    </a>
                </div>
            ` : `
                <div style="background-color: #d4edda; padding: 15px; border-radius: 4px; margin: 20px auto; max-width: 500px; border-left: 4px solid #28a745;">
                    <h3>✅ Google Calendar Connected</h3>
                    <p>Your Google Calendar integration is ready!</p>
                </div>
            `}
        </div>
    `);
});

// 9. Start the server (ONLY ONE app.listen call)
app.listen(port, () => {
    console.log(`🚀 Server listening at http://localhost:${port}`);

    // Check environment variables
    console.log(`📧 Email User: ${process.env.EMAIL_USER ? 'Loaded' : 'NOT LOADED'}`);
    console.log(`📧 Email Password: ${process.env.EMAIL_PASS ? 'Loaded' : 'NOT LOADED'}`);
    console.log(`📧 Destination Email: ${process.env.DESTINATION_EMAIL ? 'Loaded' : 'NOT LOADED'}`);
    console.log(`🤖 Gemini API Key: ${process.env.GEMINI_API_KEY ? 'Loaded' : 'NOT LOADED'}`);
    console.log(`📅 Google Calendar: ${process.env.GOOGLE_CALENDAR_ID ? 'Configured' : 'Not Configured'}`);
    console.log(`🔑 Google Client ID: ${process.env.GOOGLE_CLIENT_ID ? 'Loaded' : 'NOT LOADED'}`);
    console.log(`🔒 Google Client Secret: ${process.env.GOOGLE_CLIENT_SECRET ? 'Loaded' : 'NOT LOADED'}`);
    console.log(`🔄 Google Refresh Token: ${process.env.GOOGLE_REFRESH_TOKEN ? 'Loaded' : 'NOT LOADED'}`);

    // Warnings
    if (!process.env.GEMINI_API_KEY) {
        console.warn('⚠️  WARNING: GEMINI_API_KEY is not loaded. Chatbot functionality may not work.');
    }
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('⚠️  WARNING: Email credentials not loaded. Email functionality will not work.');
    }
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
        console.warn('⚠️  WARNING: Google OAuth credentials not loaded. Google Calendar setup will not work.');
    }
    if (!process.env.GOOGLE_REFRESH_TOKEN) {
        console.warn('⚠️  INFO: No Google refresh token found. Visit http://localhost:' + port + '/auth/google to set up Google Calendar integration.');
    }
});

module.exports = app;
