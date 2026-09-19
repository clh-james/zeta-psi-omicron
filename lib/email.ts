import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "missing-key");
const FROM_EMAIL = "Zeta Psi Omicron <no-reply@zetapsiomicron.org>";

/**
 * Fallback logger when running locally without an API key.
 */
function logEmailFallback(subject: string, to: string[] | string, html: string) {
  console.log("=========================================");
  console.log(`[MOCK EMAIL SENT]`);
  console.log(`To: ${Array.isArray(to) ? to.join(", ") : to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Body: ${html.substring(0, 200)}...`);
  console.log("=========================================");
}

export async function sendMembershipApprovedEmail(email: string, name: string, membershipNumber: string) {
  const subject = "Membership Approved - Zeta Psi Omicron";
  const html = `
    <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
      <h2 style="color: #C9A227;">Welcome, Brother ${name}!</h2>
      <p>Congratulations. Your registration to the National Member Information System has been approved by the National Council.</p>
      <p>Your official Membership Number is: <strong>${membershipNumber}</strong></p>
      <p>You may now log in to access the National Directory, announcements, and exclusive fraternity resources.</p>
      <br/>
      <p>Fraternally,<br/>Zeta Psi Omicron National Council</p>
    </div>
  `;

  if (!process.env.RESEND_API_KEY) {
    logEmailFallback(subject, email, html);
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject,
      html,
    });
  } catch (error) {
    console.error("Failed to send approval email:", error);
  }
}

export async function sendMembershipRejectedEmail(email: string, name: string, reason: string) {
  const subject = "Registration Update - Zeta Psi Omicron";
  const html = `
    <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
      <h2 style="color: #902C2C;">Registration Update</h2>
      <p>Hello ${name},</p>
      <p>Your recent registration to the Zeta Psi Omicron National Member Information System could not be approved at this time.</p>
      <p><strong>Reason provided:</strong> ${reason}</p>
      <p>If you believe this is an error, please reach out to your Chapter Grand Master or Regional Coordinator.</p>
    </div>
  `;

  if (!process.env.RESEND_API_KEY) {
    logEmailFallback(subject, email, html);
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject,
      html,
    });
  } catch (error) {
    console.error("Failed to send rejection email:", error);
  }
}

export async function sendAnnouncementBlastEmail(emails: string[], title: string, body: string) {
  if (!emails || emails.length === 0) return;

  const subject = `[ZPO] ${title}`;
  const html = `
    <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
      <h2 style="color: #C9A227;">${title}</h2>
      <p style="white-space: pre-wrap;">${body}</p>
      <br/>
      <hr style="border: 0; border-top: 1px solid #eee;" />
      <p style="font-size: 12px; color: #888;">You are receiving this because you are an active member of Zeta Psi Omicron.</p>
    </div>
  `;

  if (!process.env.RESEND_API_KEY) {
    logEmailFallback(subject, emails.slice(0, 5).join(", ") + ` (+${Math.max(0, emails.length - 5)} more)`, html);
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      bcc: emails,
      to: FROM_EMAIL, 
      subject,
      html,
    });
  } catch (error) {
    console.error("Failed to send announcement blast:", error);
  }
}
