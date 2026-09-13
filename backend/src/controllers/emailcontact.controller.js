import { sendContactEmail } from "../utils/mailer.js";

export const sendContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required."
      });
    }

    await sendContactEmail(name, email, subject, message);

    return res.status(200).json({
      success: true,
      message: "Your message has been sent successfully."
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error sending contact message.",
      error: error.message
    });
  }
};