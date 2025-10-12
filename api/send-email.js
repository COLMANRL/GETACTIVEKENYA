const sgMail = require('@sendgrid/mail');

module.exports = async function (context, req) {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    context.res = {
      status: 200,
      headers
    };
    return;
  }

  // Only allow POST
  if (req.method !== "POST") {
    context.res = {
      status: 405,
      headers,
      body: JSON.stringify({ message: "Method Not Allowed" })
    };
    return;
  }

  try {
    const { subject, name, email, message } = req.body;

    // Validate inputs
    if (!subject || !name || !email || !message) {
      context.res = {
        status: 400,
        headers,
        body: JSON.stringify({ message: 'All fields are required' })
      };
      return;
    }

    // Set up SendGrid
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: process.env.EMAIL_TO,
      from: process.env.EMAIL_FROM,  // Must be verified with SendGrid
      replyTo: email,
      subject: Website Contact: ,
      text: Name: \nEmail: \n\nMessage:\n,
      html: 
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> </p>
        <p><strong>Email:</strong> </p>
        <p><strong>Subject:</strong> </p>
        <h4>Message:</h4>
        <p></p>
      ,
    };

    await sgMail.send(msg);

    context.res = {
      status: 200,
      headers,
      body: JSON.stringify({ message: 'Email sent successfully' })
    };
  } catch (error) {
    console.error('Error sending email:', error);
    context.res = {
      status: 500,
      headers,
      body: JSON.stringify({ message: 'Failed to send email' })
    };
  }
};
