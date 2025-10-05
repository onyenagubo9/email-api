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
const FROM_EMAIL = "info.crptex.usa@gmail.com";
const FROM_NAME = "Crptex";
const PORT = 5000;

// 🔹 Home route (for status check)
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head><title>Backend Status</title></head>
      <body style="font-family: Arial; text-align: center; padding: 50px;">
        <h1>✅ Backend is running!</h1>
        <p>You can now test the <b>/send-login-email</b> and <b>/send-signup-email</b> APIs.</p>
      </body>
    </html>
  `);
});

// 🔹 POST route for sending login email (Styled)
app.post("/send-login-email", async (req, res) => {
  const { to, name } = req.body;

  if (!to) return res.status(400).json({ error: "Missing recipient email" });

  const safeName = name || "Investor";

  const html = `
    <html>
      <body style="margin:0; padding:0; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color:#f4f7fb;">
        <div style="max-width:600px; margin:40px auto; background-color:#ffffff; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.08); overflow:hidden;">

          <!-- Header -->
          <div style="background-color:#0a1f44; padding:25px; text-align:center;">
            <h1 style="color:#ffd700; font-size:26px; letter-spacing:1px;">Crptex Login Alert</h1>
          </div>

          <!-- Body -->
          <div style="padding:30px;">
            <h2 style="color:#0a1f44;">Hi ${safeName},</h2>
            <p style="color:#555; font-size:15px; line-height:1.6;">
              We noticed a successful login to your <strong>Crptex</strong> account.
            </p>

            <div style="margin:20px 0; background-color:#f8f9fc; border-left:4px solid #ffd700; padding:15px; border-radius:6px;">
              <p style="margin:0; color:#333; font-size:14px;">
                <strong>Details:</strong><br/>
                • Time: ${new Date().toLocaleString()}<br/>
                • Device: Unknown (for security reasons)<br/>
                • Location: Not disclosed
              </p>
            </div>

            <p style="color:#555; font-size:15px; line-height:1.6;">
              If this was you, you can safely ignore this message.<br/>
              <strong>If you didn’t log in</strong>, please reset your password immediately to protect your account.
            </p>

            <div style="text-align:center; margin:30px 0;">
              <a href="https://crptex.app/reset-password"
                style="display:inline-block; background-color:#ffd700; color:#0a1f44; padding:12px 25px; font-weight:600; border-radius:8px; text-decoration:none; font-size:15px;">
                Secure My Account
              </a>
            </div>

            <p style="color:#777; font-size:13px; line-height:1.5;">
              Need help? Our support team is available 24/7 — just reply to this email.
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color:#0a1f44; padding:15px; text-align:center;">
            <p style="color:#ccc; font-size:12px; margin:0;">
              © 2025 Crptex. All rights reserved.<br/>
              <a href="https://crptex.app" style="color:#ffd700; text-decoration:none;">Visit Website</a>
            </p>
          </div>

        </div>
      </body>
    </html>
  `;

  try {
    const request = await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: { Email: FROM_EMAIL, Name: FROM_NAME },
          To: [{ Email: to, Name: safeName }],
          Subject: "Login Notification — Crptex Security Alert",
          HTMLPart: html,
        },
      ],
    });

    console.log("✅ Styled login email sent:", request.body);
    res.json({ ok: true, message: `Styled login email sent to ${to}` });
  } catch (err) {
    console.error("❌ Mailjet Error:", err.message || err);
    res.status(500).json({ ok: false, error: err.message || err });
  }
});

// 🔹 POST route for sending signup email (Styled)
app.post("/send-signup-email", async (req, res) => {
  const { to, name } = req.body;

  if (!to) return res.status(400).json({ error: "Missing recipient email" });

  const safeName = name || "Investor";

  const html = `
    <html>
      <body style="margin:0; padding:0; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color:#f4f7fb;">
        <div style="max-width:600px; margin:40px auto; background-color:#ffffff; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.08); overflow:hidden;">
          
          <!-- Header -->
          <div style="background-color:#0a1f44; padding:25px; text-align:center;">
            <h1 style="color:#ffd700; font-size:26px; letter-spacing:1px;">Welcome to Crptex</h1>
          </div>
          
          <!-- Body -->
          <div style="padding:30px;">
            <h2 style="color:#0a1f44;">Hi ${safeName},</h2>
            <p style="color:#555; font-size:15px; line-height:1.6;">
              Welcome aboard! 🎉 We're excited to have you join <strong>Crptex</strong> — your trusted platform for smart and secure investments.
            </p>
            
            <p style="color:#555; font-size:15px; line-height:1.6;">
              Start exploring your dashboard, manage your portfolio, and make your first investment confidently.
            </p>

            <div style="text-align:center; margin:30px 0;">
              <a href="https://crptex.app" 
                style="display:inline-block; background-color:#ffd700; color:#0a1f44; padding:12px 25px; font-weight:600; border-radius:8px; text-decoration:none; font-size:15px;">
                Go to Dashboard
              </a>
            </div>

            <p style="color:#777; font-size:13px; line-height:1.5;">
              If you have any questions or need help getting started, our support team is here for you — just reply to this email.
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color:#0a1f44; padding:15px; text-align:center;">
            <p style="color:#ccc; font-size:12px; margin:0;">
              © 2025 Crptex. All rights reserved.<br/>
              <a href="https://crptex.app" style="color:#ffd700; text-decoration:none;">Visit Website</a>
            </p>
          </div>

        </div>
      </body>
    </html>
  `;

  try {
    const request = await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: { Email: FROM_EMAIL, Name: FROM_NAME },
          To: [{ Email: to, Name: safeName }],
          Subject: "Welcome to Crptex — Let's Get Started!",
          HTMLPart: html,
        },
      ],
    });

    console.log("✅ Styled signup email sent:", request.body);
    res.json({ ok: true, message: `Styled signup email sent to ${to}` });
  } catch (err) {
    console.error("❌ Mailjet Error:", err.message || err);
    res.status(500).json({ ok: false, error: err.message || err });
  }
});


// 🔹 Start server
app.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
