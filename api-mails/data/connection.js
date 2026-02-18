import "dotenv/config";
import Queue from "bull";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const emailQueue = new Queue("emailQueue", {
  redis: {
    host: "localhost",
    port: 6379,
  },
  defaultJobOptions: {
    attempts: 3,
  },
});

emailQueue.process(async (job) => {
  const { to, subject, html } = job.data;
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  });
});

export { transporter, emailQueue };
