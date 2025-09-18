// lib/email.ts
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

interface EmailConfig {
    host: string;
    port: number;
    secure: boolean;
    auth: {
        user: string;
        pass: string;
    };
}

class EmailService {
    private transporter: nodemailer.Transporter;
    private jwtSecret: string;

    constructor() {
        this.jwtSecret = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production';

        // Email configuration - you can use any SMTP provider
        const emailConfig: any = {
            host: process.env.SMTP_HOST!,
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false,
            auth: {
                user: process.env.SMTP_USER!,
                pass: process.env.SMTP_PASS!,
            },
            tls: { ciphers: 'SSLv3' },
            requireTLS: true,
            connectionTimeout: 60000,
            greetingTimeout: 30000,
            socketTimeout: 60000,
        };

        this.transporter = nodemailer.createTransport(emailConfig);
    }

    // Generate a JWT token for password reset
    generateResetToken(userId: string, email: string): string {
        const payload = {
            userId,
            email,
            type: 'password-reset',
            timestamp: Date.now(),
        };

        // Token expires in 2 minutes
        return jwt.sign(payload, this.jwtSecret, { expiresIn: '2m' });
    }

    // Verify and decode reset token
    verifyResetToken(token: string): { userId: string; email: string; issuedAtMs: number } | null {
        try {
            const decoded = jwt.verify(token, this.jwtSecret) as any;

            if (decoded.type !== 'password-reset') {
                throw new Error('Invalid token type');
            }

            return {
                userId: decoded.userId,
                email: decoded.email,
                issuedAtMs: decoded.timestamp || (decoded.iat ? decoded.iat * 1000 : 0),
            };
        } catch (error) {
            console.error('Token verification failed:', error);
            return null;
        }
    }

    // Send password reset email
    async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
        const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

        const mailOptions = {
            from: `"Scanova Diagnostics" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
            to: email,
            subject: 'Reset Your Password - Scanova Diagnostics',
            html: this.generateResetEmailHTML(resetUrl),
            text: this.generateResetEmailText(resetUrl),
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log('✅ Password reset email sent successfully to:', email);
        } catch (error) {
            console.error('❌ Failed to send password reset email:', error);
            throw new Error('Failed to send password reset email');
        }
    }

    // Generate HTML email template
    private generateResetEmailHTML(resetUrl: string): string {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset - Scanova Diagnostics</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #0E7AA4; padding-bottom: 20px;">
        <h1 style="color: #0E7AA4; margin: 0;">Scanova Diagnostics</h1>
        <p style="color: #666; margin: 5px 0 0 0;">Your Health, Our Priority</p>
    </div>
    
    <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin: 20px 0;">
        <h2 style="color: #0E7AA4; margin-top: 0;">Reset Your Password</h2>
        
        <p>Hello,</p>
        
        <p>We received a request to reset the password for your Scanova Diagnostics account. If you made this request, click the button below to set a new password:</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background: linear-gradient(135deg, #0E7AA4, #1a8cb8); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 8px; 
                      display: inline-block; 
                      font-weight: bold;
                      box-shadow: 0 4px 6px rgba(14, 122, 164, 0.3);">
                Reset My Password
            </a>
        </div>
        
        <p style="color: #666; font-size: 14px;">If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all; background: #e9ecef; padding: 10px; border-radius: 5px; font-size: 12px; color: #495057;">
            ${resetUrl}
        </p>
    </div>
    
    <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin: 20px 0;">
        <h3 style="color: #856404; margin-top: 0; font-size: 16px;">⚠️ Security Notice</h3>
        <ul style="color: #856404; margin: 0; padding-left: 20px;">
            <li>This link will expire in 2 minutes for your security</li>
            <li>If you didn't request this reset, please ignore this email</li>
            <li>Never share this link with anyone</li>
        </ul>
    </div>
    
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #dee2e6; text-align: center;">
        <p style="color: #666; font-size: 14px; margin: 0;">
            Need help? Contact our support team<br>
            <strong>Scanova Diagnostics</strong><br>
            Email: info@scanovadiagnostics.com
        </p>
    </div>
</body>
</html>`;
    }

    // Generate plain text email
    private generateResetEmailText(resetUrl: string): string {
        return `
Scanova Diagnostics - Password Reset

Hello,

We received a request to reset the password for your Scanova Diagnostics account.

To reset your password, please visit the following link:
${resetUrl}

This link will expire in 2 minutes for your security.

If you didn't request this password reset, please ignore this email.

Best regards,
Scanova Diagnostics Team

Need help? Contact us at info@scanovadiagnostics.com
    `;
    }

    // Send welcome email
    async sendWelcomeEmail(toEmail: string, recipientName?: string): Promise<void> {
        const name = (recipientName || '').trim() || 'there';
        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
        const loginUrl = `${baseUrl}/login`;

        const mailOptions = {
            from: `"Scanova Diagnostics" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
            to: toEmail,
            subject: 'Welcome to Scanova Diagnostics',
            html: this.generateWelcomeEmailHTML(name, loginUrl),
            text: this.generateWelcomeEmailText(name, loginUrl),
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log('✅ Welcome email sent to:', toEmail);
        } catch (error) {
            console.error('❌ Failed to send welcome email:', error);
            // Do not throw to avoid blocking signup flow; log only
        }
    }

    private generateWelcomeEmailHTML(name: string, loginUrl: string): string {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to Scanova Diagnostics</title>
  <style>
    .btn { background: linear-gradient(135deg, #0E7AA4, #1a8cb8); color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block; font-weight: 600; }
  </style>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align:center; margin-bottom: 24px; border-bottom: 3px solid #0E7AA4; padding-bottom: 16px;">
      <h1 style="color:#0E7AA4; margin:0;">Scanova Diagnostics</h1>
      <p style="color:#666; margin:6px 0 0;">Your Health, Our Priority</p>
    </div>
    <div style="background:#f8f9fa; padding:24px; border-radius:10px;">
      <h2 style="color:#0E7AA4; margin-top:0;">Welcome, ${name}!</h2>
      <p>Thanks for creating your Scanova Diagnostics account. We're excited to support your health journey with convenient home collections, trusted reports, and seamless booking.</p>
      <p style="text-align:center; margin:28px 0;">
        <a href="${loginUrl}" class="btn">Log in to your account</a>
      </p>
      <p style="color:#555; font-size:14px;">Need help getting started? Reply to this email or reach us at info@scanovadiagnostics.com</p>
    </div>
    <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #dee2e6; text-align:center; color:#666; font-size:13px;">
      <p style="margin:0;">Scanova Diagnostics</p>
    </div>
  </body>
</html>`;
    }

    private generateWelcomeEmailText(name: string, loginUrl: string): string {
        return `
Welcome to Scanova Diagnostics, ${name}!

Thanks for creating your account. Log in to get started:
${loginUrl}

If you need help, email info@scanovadiagnostics.com

— Scanova Diagnostics Team
`;
    }

    // Test email configuration
    async testConnection(): Promise<boolean> {
        try {
            await this.transporter.verify();
            console.log('✅ Email service is ready');
            return true;
        } catch (error) {
            console.error('❌ Email service configuration error:', error);
            return false;
        }
    }
}

export const emailService = new EmailService();