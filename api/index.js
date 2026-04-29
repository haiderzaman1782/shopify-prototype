import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // info.proximux@gmail.com
    pass: process.env.EMAIL_PASS  // Gmail App Password
  }
});

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    replyTo: email,
    subject: `New Lead from PROXIMUX: ${name}`,
    text: `
      Name: ${name}
      Email: ${email}
      
      Project Details:
      ${message}
    `,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background-color: #000; padding: 24px; text-align: center;">
          <h1 style="color: #c8f135; margin: 0; font-size: 24px;">PROXIMUX Lead</h1>
        </div>
        <div style="padding: 32px; background-color: #fff; color: #1a202c;">
          <h2 style="margin-top: 0; border-bottom: 2px solid #edf2f7; padding-bottom: 12px;">New Inquiry</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #3182ce;">${email}</a></p>
          <div style="margin-top: 24px; padding: 16px; background-color: #f7fafc; border-radius: 8px; border-left: 4px solid #c8f135;">
            <p style="margin-top: 0; font-weight: bold; color: #4a5568;">Project Details:</p>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          <p style="margin-top: 32px; font-size: 14px; color: #718096; text-align: center; border-top: 1px solid #edf2f7; pt: 16px;">
            This inquiry was sent from your website contact form.
          </p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
