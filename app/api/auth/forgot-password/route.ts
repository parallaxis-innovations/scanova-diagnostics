import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import crypto from "crypto";
import nodemailer from "nodemailer";

const schema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = schema.parse(body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Do not reveal user existence
      return NextResponse.json({ message: "If the email exists, we'll send a reset link" }, { status: 200 });
    }

    // Remove existing tokens for this identifier
    // @ts-ignore - Prisma client should include verificationToken delegate
    await prisma.verificationToken.deleteMany({ where: { identifier: email } });

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    // @ts-ignore - Prisma client should include verificationToken delegate
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    const appUrlEnv = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL;
    const origin = appUrlEnv || request.headers.get("origin") || "http://localhost:3000";
    const resetUrl = `${origin}/reset-password?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT || 587);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    // If SMTP is not configured, log and return success to avoid blocking local/dev flows
    if (!smtpHost || !smtpUser || !smtpPass) {
      console.warn("SMTP is not fully configured (SMTP_HOST/SMTP_USER/SMTP_PASS). Skipping email send.");
      return NextResponse.json({ message: "If the email exists, we'll send a reset link" }, { status: 200 });
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: false,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      tls: {
        rejectUnauthorized: false,
      },
      requireTLS: true,
      connectionTimeout: 60000,
      greetingTimeout: 30000,
      socketTimeout: 60000,
    });

    try {
      const verification = await transporter.verify();
      console.log("verification", verification);
    } catch (verifyError) {
      console.warn("SMTP verification failed, attempting to send anyway:", verifyError);
    }

    try {
      const mail = await transporter.sendMail({
        from: smtpUser || "noreply@scanovadiagnostics.com",
        to: email,
        subject: "Reset your password",
        html: `
        <p>Hello${user.name ? ` ${user.name}` : ""},</p>
        <p>We received a request to reset your password. Click the button below to set a new password. This link will expire in 1 hour.</p>
        <p><a href="${resetUrl}" style="display:inline-block;padding:10px 16px;background:#0E7AA4;color:#fff;text-decoration:none;border-radius:6px">Reset Password</a></p>
        <p>If you did not request this, you can safely ignore this email.</p>
      `,
      });
    } catch (sendError) {
      console.error("Failed to send reset email:", sendError);
      // Do not fail the flow due to email errors; token is already created
    }

    return NextResponse.json({ message: "If the email exists, we'll send a reset link" }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Validation failed", errors: error.errors }, { status: 400 });
    }
    console.error("Forgot password error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
} 