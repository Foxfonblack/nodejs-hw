import nodemailer from 'nodemailer';

const port = Number(process.env.SMTP_PORT);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port,
  secure: port === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  // Force IPv4: many cloud hosts (e.g. Render) have broken IPv6 egress,
  // which makes SMTP connections hang and time out (ETIMEDOUT on CONN).
  family: 4,
  connectionTimeout: 20000,
  greetingTimeout: 20000,
});

export const sendEmail = async ({ from, to, subject, html }) => {
  return transporter.sendMail({
    from: from || process.env.SMTP_FROM,
    to,
    subject,
    html,
  });
};
