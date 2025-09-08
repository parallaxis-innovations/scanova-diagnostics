import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { directusService } from '@/lib/directus-service';
import { getSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const formData = await request.json();
    
    // Create appointment record in Directus with comprehensive fields
    let appointmentRecord = null;
    if (session?.user) {
      try {
        const appointmentData = {
          // Basic Information
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          date: formData.date,
          time: formData.time,
          tests: formData.tests,
          notes: formData.notes || null,
          user_id: (session.user as any).id,
          status: 'pending',
          
          // Additional fields from form (if provided)
          collection_fee: formData.collection_fee || null,
          total_amount: formData.total_amount || null,
          technicial_notes: null, // To be filled by technician later
          
          // Timestamp fields (will be set by Directus automatically for created/updated)
          confirmed_date: null, // To be set when appointment is confirmed
          completed_date: null, // To be set when appointment is completed
        };

        appointmentRecord = await directusService.createItem('appointments', appointmentData, (session as any).accessToken);
      } catch (error) {
        console.error('Error saving appointment to Directus:', error);
        // Continue with email sending even if Directus save fails
      }
    }
    
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      tls: {
        rejectUnauthorized: false,
        ciphers: 'SSLv3'
      },
      requireTLS: true,
      connectionTimeout: 60000,
      greetingTimeout: 30000,
      socketTimeout: 60000
    });

    try {
      const verification = await transporter.verify();
    } catch (verifyError) {
      console.error('SMTP verification failed:', verifyError);
    }

    // Email to patient
    const patientMailOptions = {
      from: process.env.SMTP_USER || 'noreply@scanovadiagnostics.com',
      to: formData.email,
      subject: 'Home Collection Booking Confirmed - Scanova Diagnostics',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #0D7EA8, #1E90A0); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">SCANOVA DIAGNOSTICS</h1>
            <p style="color: white; margin: 5px 0 0 0; opacity: 0.9;">Home Collection Booking Confirmed</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #0D7EA8; margin-bottom: 20px;">Dear ${formData.name},</h2>
            
            <p style="margin-bottom: 20px; line-height: 1.6; color: #555;">
              Thank you for choosing Scanova Diagnostics! Your home collection request has been received successfully. 
              Our team will contact you within 15 minutes to confirm your appointment.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #0D7EA8; margin-top: 0;">Booking Details:</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #333;">Name:</td>
                  <td style="padding: 8px 0; color: #555;">${formData.name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #333;">Phone:</td>
                  <td style="padding: 8px 0; color: #555;">${formData.phone}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #333;">Address:</td>
                  <td style="padding: 8px 0; color: #555;">${formData.address}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #333;">City:</td>
                  <td style="padding: 8px 0; color: #555;">${formData.city}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #333;">Preferred Date:</td>
                  <td style="padding: 8px 0; color: #555;">${formData.date}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #333;">Time Slot:</td>
                  <td style="padding: 8px 0; color: #555;">${formData.time}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #333;">Tests Required:</td>
                  <td style="padding: 8px 0; color: #555;">${formData.tests}</td>
                </tr>
              </table>
            </div>
            
            <div style="background: #e8f4f8; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
              <h4 style="color: #0D7EA8; margin: 0 0 10px 0;">Important Reminders:</h4>
              <ul style="margin: 0; padding-left: 20px; color: #555;">
                <li>Our technician will call you 30 minutes before arrival</li>
                <li>Please ensure you're available at the scheduled time</li>
                <li>Free collection applies to orders above ₹500</li>
                <li>Fasting requirements will be communicated if necessary</li>
              </ul>
            </div>
            
            <p style="margin-bottom: 20px; line-height: 1.6; color: #555;">
              For any questions or changes to your appointment, please contact us at 
              <strong style="color: #0D7EA8;">+91 98765 43210</strong>.
            </p>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #888; font-size: 14px;">
                Thank you for trusting Scanova Diagnostics with your healthcare needs.
              </p>
            </div>
          </div>
        </div>
      `
    };

    // Email to admin
    const adminMailOptions = {
      from: process.env.SMTP_USER || 'noreply@scanovadiagnostics.com',
      to: process.env.ADMIN_EMAIL || 'admin@scanovadiagnostics.com',
      subject: 'New Home Collection Booking - Action Required',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #0D7EA8, #1E90A0); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">SCANOVA DIAGNOSTICS</h1>
            <p style="color: white; margin: 5px 0 0 0; opacity: 0.9;">New Home Collection Request</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #0D7EA8; margin-bottom: 20px;">New Booking Alert</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #333; border-bottom: 1px solid #eee;">Name:</td>
                  <td style="padding: 8px 0; color: #555; border-bottom: 1px solid #eee;">${formData.name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #333; border-bottom: 1px solid #eee;">Phone:</td>
                  <td style="padding: 8px 0; color: #555; border-bottom: 1px solid #eee;">${formData.phone}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #333; border-bottom: 1px solid #eee;">Email:</td>
                  <td style="padding: 8px 0; color: #555; border-bottom: 1px solid #eee;">${formData.email}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #333; border-bottom: 1px solid #eee;">Address:</td>
                  <td style="padding: 8px 0; color: #555; border-bottom: 1px solid #eee;">${formData.address}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #333; border-bottom: 1px solid #eee;">City:</td>
                  <td style="padding: 8px 0; color: #555; border-bottom: 1px solid #eee;">${formData.city}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #333; border-bottom: 1px solid #eee;">Preferred Date:</td>
                  <td style="padding: 8px 0; color: #555; border-bottom: 1px solid #eee;">${formData.date}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #333; border-bottom: 1px solid #eee;">Time Slot:</td>
                  <td style="padding: 8px 0; color: #555; border-bottom: 1px solid #eee;">${formData.time}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #333; border-bottom: 1px solid #eee;">Tests Required:</td>
                  <td style="padding: 8px 0; color: #555; border-bottom: 1px solid #eee;">${formData.tests}</td>
                </tr>
                ${formData.notes ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #333;">Notes:</td>
                  <td style="padding: 8px 0; color: #555;">${formData.notes}</td>
                </tr>
                ` : ''}
              </table>
            </div>
            
            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107;">
              <p style="margin: 0; color: #856404; font-weight: bold;">
                ⚠️ Action Required: Please contact the patient within 15 minutes to confirm the appointment.
              </p>
            </div>
          </div>
        </div>
      `
    };

    // Send emails
    // if (formData.email) {
    //   const mail = await transporter.sendMail(patientMailOptions);
    //   console.log('Email sent to patient:', mail);
    // }

    return NextResponse.json({ 
      success: true,
      message: 'Booking successful',
      appointmentId: appointmentRecord?.data?.id || null
    }, { status: 200 });
  } catch (error) {
    console.error('Error processing booking:', error);
    return NextResponse.json({ message: 'Error processing booking' }, { status: 500 });
  }
}