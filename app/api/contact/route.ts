import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
        ciphers: "SSLv3",
      },
      requireTLS: true,
      connectionTimeout: 60000,
      greetingTimeout: 30000,
      socketTimeout: 60000,
    });

    // Mail to admin
    const adminMailOptions = {
      from: process.env.SMTP_USER || "noreply@scanovadiagnostics.com",
      to: process.env.ADMIN_EMAIL || "admin@scanovadiagnostics.com",
      subject: `New Contact Form Message from ${formData.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f7f9fb; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
      
      <!-- Header -->
      <div style="background: #007b8f; color: #ffffff; text-align: center; padding: 20px;">
        <h1 style="margin:0; font-size: 22px; letter-spacing: 1px;">SCANOVA DIAGNOSTICS</h1>
        <p style="margin:0; font-size: 14px;">New Contact Form Submission</p>
      </div>
      
      <!-- Body -->
      <div style="padding: 20px;">
        <h2 style="color: #007b8f; font-size: 18px; margin-bottom: 15px;">Message Details</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 8px; font-weight: bold; color: #333;">Name:</td>
            <td style="padding: 8px; color: #555;">${formData.name}</td>
          </tr>
          <tr style="background:#f9f9f9;">
            <td style="padding: 8px; font-weight: bold; color: #333;">Email:</td>
            <td style="padding: 8px; color: #555;">${formData.email}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; color: #333;">Phone:</td>
            <td style="padding: 8px; color: #555;">${formData.phone || "N/A"}</td>
          </tr>
          <tr style="background:#f9f9f9;">
            <td style="padding: 8px; font-weight: bold; color: #333;">Message:</td>
            <td style="padding: 8px; color: #555;">${formData.message}</td>
          </tr>
        </table>
      </div>
      
      <!-- Footer Note -->
      <div style="background: #fef3c7; padding: 12px 20px; border-top: 1px solid #f1e3a8; color: #92400e; font-size: 14px;">
        ⚠️ Please respond to this inquiry at the earliest.
      </div>
    </div>
  </div>
      `,
    };

    await transporter.sendMail(adminMailOptions);

    return NextResponse.json(
      { message: "Your message has been sent successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { message: "Error sending your message. Please try again." },
      { status: 500 }
    );
  }

  
}
