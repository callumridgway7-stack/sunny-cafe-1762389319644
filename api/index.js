const express = require('express');
const nodemailer = require('nodemailer');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure Nodemailer transporter
// Set the following environment variables in your Vercel dashboard:
// SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
// Example: Use Gmail SMTP or a service like SendGrid

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.example.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, // Use true for port 465
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || ''
  }
});

// Handle POST /contact
app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.redirect('/contact.html?error=true');
  }

  const mailOptions = {
    from: email,
    to: 'hello@sunnycafe.com',
    subject: `Contact Form Submission from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.redirect('/contact.html?error=true');
    }
    console.log('Email sent:', info.response);
    res.redirect('/contact.html?success=true');
  });
});

module.exports = app;