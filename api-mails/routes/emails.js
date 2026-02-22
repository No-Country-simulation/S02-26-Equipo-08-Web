import express from "express";
import auth from "../middleware/auth.js";
import { emailTemplates } from "../data/emails.js";
import { emailQueue } from "../data/connection.js";

const emailsRouter = express.Router();

emailsRouter.post("/sendEmail", auth, async (req, res) => {
  try {
    const { to, subject, template, params } = req.body;

    if (!emailTemplates[template]) {
      return res.status(400).json({ error: `Template "${template}" no encontrado` });
    }

    const html = emailTemplates[template](params);
    const job = { to, subject, html };
    await emailQueue.add(job);

    res.status(200).json({ message: "Email en cola para ser enviado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default emailsRouter;
