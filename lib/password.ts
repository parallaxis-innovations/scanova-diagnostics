// server-only password utilities to avoid bundling nodemailer in client
import 'server-only';
import { emailService } from './email';
import { directusService } from './directus';

export async function sendForgotPasswordEmail(email: string) {
  // Check if user exists (do not leak existence)
  const user = await directusService.getUserByEmail(email);
  if (!user) {
    return { success: true };
  }
  const resetToken = emailService.generateResetToken(user.id, user.email);
  await emailService.sendPasswordResetEmail(user.email, resetToken);
  return { success: true };
}


