// server/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Email route
app.post('/api/send-email', async (req, res) => {
  const { subject, name, email, message } = req.body;

  // Create a transporter
  const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

  // Email options
  const mailOptions = {
  from: process.env.EMAIL_USER,
  to: process.env.DESTINATION_EMAIL,
    subject: `${subject || 'New contact form submission'} from ${name}`,
    text: `
      Name: ${name}
      Email: ${email}
      Subject: ${subject || 'N/A'}
      Message: ${message}
    `,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
        <h2 style="color: #2e7d32;">New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
        <h3>Message:</h3>
        <p style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #2e7d32;">${message}</p>
      </div>
    `
  };

  try {
    // Send email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
