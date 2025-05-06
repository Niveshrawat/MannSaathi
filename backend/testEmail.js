require('dotenv').config();
const sendEmail = require('./utils/sendEmail');


(async () => {
  try {
    await sendEmail({
      to: process.env.EMAIL_USER, // send to yourself for testing
      subject: 'Test Email from Nodemailer',
      text: 'This is a test email sent from your Node.js app!',
      html: '<b>This is a test email sent from your Node.js app!</b>'
    });
    console.log('Test email sent! Check your inbox (and spam folder).');
  } catch (err) {
    console.error('Error sending test email:', err);
  }
})(); 