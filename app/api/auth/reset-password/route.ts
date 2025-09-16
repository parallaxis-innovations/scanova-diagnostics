import { NextResponse } from "next/server";
import { directusApi } from "@/lib/directus";
import { emailService } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Reset token is required" },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { success: false, message: "New password is required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Verify the JWT token
    const tokenData = emailService.verifyResetToken(token);
    
    if (!tokenData) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired reset token. Please request a new password reset." },
        { status: 400 }
      );
    }

    // Update the user's password directly in Directus
    await directusApi.updateUserPassword(tokenData.userId, password);

    return NextResponse.json({
      success: true,
      message: "Password has been successfully reset. You can now log in with your new password."
    });

  } catch (error: any) {
    console.error("❌ Password reset failed:", error);
    
    // Handle specific error cases
    if (error.message?.includes('Invalid token') || error.message?.includes('expired')) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired reset token. Please request a new password reset." },
        { status: 400 }
      );
    }

    if (error.message?.includes('User not found')) {
      return NextResponse.json(
        { success: false, message: "User account not found. Please contact support." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to reset password. Please try again." },
      { status: 500 }
    );
  }
}