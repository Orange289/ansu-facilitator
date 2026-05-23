import {NextResponse} from "next/server";
import nodemailer from "nodemailer";

const recipient = process.env.CONTACT_TO || "ansu.facilitator@gmail.com";

function getSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS?.replace(/\s/g, "");

  if (!host || !user || !pass) {
    return null;
  }

  return {
    host,
    port,
    secure: process.env.SMTP_SECURE === "true" || port === 465,
    auth: {user, pass}
  };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      message?: string;
    };

    const name = body.name?.trim();
    const email = body.email?.trim();
    const message = body.message?.trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        {error: "Name, email, and message are required."},
        {status: 400}
      );
    }

    const smtpConfig = getSmtpConfig();

    if (!smtpConfig) {
      return NextResponse.json(
        {error: "Email service is not configured."},
        {status: 500}
      );
    }

    const transporter = nodemailer.createTransport(smtpConfig);
    const from = process.env.CONTACT_FROM || smtpConfig.auth.user;
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");

    await transporter.sendMail({
      from,
      to: recipient,
      replyTo: email,
      subject: `New message from ${name}`,
      text: `Name: ${name}
Email: ${email}

${message}`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#2f2e2a;">
          <h2>New contact form message</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Message:</strong></p>
          <p>${safeMessage}</p>
        </div>
      `
    });

    return NextResponse.json({ok: true});
  } catch (error) {
    console.error("Contact form error", error);
    return NextResponse.json(
      {error: "Failed to send message."},
      {status: 500}
    );
  }
}
