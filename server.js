const express = require("express");
const nodemailer = require("nodemailer");

const app = express();
app.use(express.json());

// 🔹 Direct variable definitions (hardcoded)
const GMAIL_USER = "info.crptex.usa@gmail.com";
const GMAIL_PASS = "mwmx qhty yegc ifec"; // your Gmail app password
const FROM_EMAIL = "Crptex <info.crptex.usa@gmail.com>";
const PORT = 5000;

// Gmail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS,
  },
});

// Main page to check if backend is running
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head><title>Backend Status</title></head>
      <body style="font-family: Arial; text-align: center; padding: 50px;">
        <h1>✅ Backend is running!</h1>
        <p>You can now test the /send-login-email API.</p>
      </body>
    </html>
  `);
});

// Login email route
app.post("/send-login-email", async (req, res) => {
  const { to, name } = req.body;

  if (!to) return res.status(400).json({ error: "Missing recipient email" });

  const safeName = name || "Friend";

  const html = `
    <html>
      <body style="font-family: Arial; margin:0; padding:0; background:#f4f5f7;">
        <div style="max-width:600px;margin:20px auto;padding:20px;background:white;border-radius:10px;box-shadow:0 0 10px rgba(0,0,0,0.1);">
          <h2 style="color:#333;">Hello ${safeName},</h2>
          <p style="color:#555;">We noticed a successful login to your account.</p>
          <p style="color:#777;">If this wasn’t you, please secure your account immediately.</p>
          <br/>
          <p style="color:#999;font-size:12px;">© 2025 Crptex. All rights reserved.</p>
        </div>
      </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: FROM_EMAIL,
      to,
      subject: "You signed in — Welcome back!",
      html,
    });
    res.json({ ok: true, message: `Login email sent to ${to}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Start server
app.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
