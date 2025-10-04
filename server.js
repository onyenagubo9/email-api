const express = require("express");
const Mailjet = require("node-mailjet");

const app = express();
app.use(express.json());

// 🔹 Mailjet credentials
const MAILJET_API_KEY = "9938ae41ece30248ac7614d92c690e6e";
const MAILJET_SECRET_KEY = "791802c2617efd3764c9ff94c11e8714";

// 🔹 Initialize Mailjet client
const mailjet = Mailjet.apiConnect(MAILJET_API_KEY, MAILJET_SECRET_KEY);

// 🔹 Constants
const FROM_EMAIL = "onyenaguboanthony9@gmail.com";
const FROM_NAME = "Crptex";
const PORT = process.env.PORT || 5000;

// 🔹 Home route (for status check)
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head><title>Backend Status</title></head>
      <body style="font-family: Arial; text-align: center; padding: 50px;">
        <h1>✅ Backend is running!</h1>
        <p>You can now test the <b>/send-login-email</b> API.</p>
      </body>
    </html>
  `);
});

// 🔹 POST route for sending login email
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
    const request = await mailjet
      .post("send", { version: "v3.1" })
      .request({
        Messages: [
          {
            From: {
              Email: FROM_EMAIL,
              Name: FROM_NAME,
            },
            To: [
              {
                Email: to,
                Name: safeName,
              },
            ],
            Subject: "You signed in — Welcome back!",
            HTMLPart: html,
          },
        ],
      });

    console.log("✅ Email sent:", request.body);
    res.json({ ok: true, message: `Login email sent to ${to}` });
  } catch (err) {
    console.error("❌ Mailjet Error:", err.message || err);
    res.status(500).json({ ok: false, error: err.message || err });
  }
});

// 🔹 Start server
app.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
