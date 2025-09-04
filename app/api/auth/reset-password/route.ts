import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  token: z.string().min(1, "Token is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, token, password } = schema.parse(body);

    // @ts-ignore - Prisma client should include verificationToken delegate
    const record = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!record || record.identifier !== email) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
    }

    if (record.expires < new Date()) {
      // @ts-ignore - Prisma client should include verificationToken delegate
      await prisma.verificationToken.deleteMany({ where: { identifier: email } });
      return NextResponse.json({ message: "Token expired" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await prisma.user.update({ where: { id: user.id }, data: { password: hashedPassword } });

    // Invalidate used tokens
    // @ts-ignore - Prisma client should include verificationToken delegate
    await prisma.verificationToken.deleteMany({ where: { identifier: email } });

    return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Validation failed", errors: error.errors }, { status: 400 });
    }
    console.error("Reset password error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
} 