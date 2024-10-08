import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create a transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendMail = async (receiver, content, subject = null, attachments = []) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: receiver,
    subject: subject || 'Welcome email',
    text: content,
    attachments,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.response}`);
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
};

export default sendMail;
