import { NextResponse } from "next/server";
import { sendForgotPasswordEmail } from "@/lib/password";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    await sendForgotPasswordEmail(email);
    
    return NextResponse.json({
      success: true,
      message: "If an account with that email exists, we've sent you a password reset link. Please check your email and spam folder."
    });

  } catch (error: any) {
    console.error("Forgot password API error:", error);
    
    // Don't reveal if email exists or not for security reasons
    return NextResponse.json({
      success: true,
      message: "If an account with that email exists, we've sent you a password reset link. Please check your email and spam folder."
    });
  }
}
