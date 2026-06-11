import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendWelcomeEmail = async (email, firstName) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Welcome to Rostar Notes Hub',
    html: `
      <h2>Welcome ${firstName}!</h2>
      <p>Thank you for joining Rostar Notes Hub.</p>
      <p>Start sharing and discovering educational notes now!</p>
      <a href="${process.env.FRONTEND_URL}/dashboard">Go to Dashboard</a>
    `,
  };

  return transporter.sendMail(mailOptions);
};

export const sendNoteApprovedEmail = async (email, noteTitle) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your note has been approved!',
    html: `
      <h2>Great News!</h2>
      <p>Your note "<strong>${noteTitle}</strong>" has been approved and is now live on Rostar Notes Hub.</p>
      <a href="${process.env.FRONTEND_URL}/dashboard">View on Dashboard</a>
    `,
  };

  return transporter.sendMail(mailOptions);
};

export const sendNoteRejectedEmail = async (email, noteTitle, reason) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Note Submission Rejected',
    html: `
      <h2>Note Not Approved</h2>
      <p>Your note "<strong>${noteTitle}</strong>" was not approved.</p>
      <p><strong>Reason:</strong> ${reason}</p>
      <p>Please review and resubmit if you'd like to try again.</p>
    `,
  };

  return transporter.sendMail(mailOptions);
};

export const sendPasswordResetEmail = async (email, resetLink) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Reset Your Password',
    html: `
      <h2>Password Reset Request</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>This link expires in 24 hours.</p>
    `,
  };

  return transporter.sendMail(mailOptions);
};

export const sendRatingNotificationEmail = async (uploaderEmail, raterName, noteTitle, rating) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: uploaderEmail,
    subject: `New Rating on "${noteTitle}"`,
    html: `
      <h2>Your Note Received a Rating!</h2>
      <p><strong>${raterName}</strong> rated your note "<strong>${noteTitle}</strong>" with <strong>${rating} stars</strong>.</p>
    `,
  };

  return transporter.sendMail(mailOptions);
};
