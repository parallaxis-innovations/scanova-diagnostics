import { directusApi } from '@/lib/directus';
import { emailService } from '@/lib/email';
import { directusService } from '@/lib/directus';
import { NextRequest, NextResponse } from "next/server";
import { z } from 'zod'

const DIRECTUS_API_URL = process.env.DIRECTUS_API_URL;
const DIRECTUS_ADMIN_TOKEN = process.env.DIRECTUS_STATIC_ADMIN_TOKEN;

const signupSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email_id: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone_number: z.string().optional(),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  age: z.string().min(1, 'Age is required'),
  gender: z.string().min(1, 'Gender is required'),
  blood_group: z.string().min(1, 'Blood group is required'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = signupSchema.parse(body)
    
    // Split name into first and last name
    const nameParts = validatedData.full_name.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || '';

    // Create user in Directus
    const directusRes = await directusApi.registerUser({
        email: validatedData.email_id,
        password: validatedData.password,
        first_name: firstName,
        last_name: lastName
  }) as any;

    if (!directusRes) {
      // Handle Directus errors
      const errorMessage =
        ((typeof directusRes === 'object' && (directusRes as any).errors?.[0]?.message) as string) ||
        'Signup failed';

      // Check for duplicate email error
      const lower = String(errorMessage).toLowerCase();
      if (lower.includes('duplicate') || lower.includes('unique')) {
        return NextResponse.json(
          { message: 'User already exists with this email' },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { message: errorMessage || 'Signup failed' },
        { status: 400 }
      );
    }

    const personalInfoRes = await directusService.createPersonalInformation({
      full_name: validatedData.full_name,
      phone_number: validatedData.phone_number,
      email_id: validatedData.email_id,
      address: validatedData.address,
      age: parseInt(validatedData.age),
      gender: validatedData.gender,
      blood_group: validatedData.blood_group,
      password: validatedData.password,
      user_id: directusRes.id,
    });
    
    if (!personalInfoRes) {
      console.error('Failed to create personal information:', personalInfoRes);
    }
    
    // Fire-and-forget welcome email (non-blocking)
    try {
      const recipientName = validatedData.full_name;
      emailService.sendWelcomeEmail(validatedData.email_id, recipientName);
    } catch (e) {
      console.warn('Welcome email dispatch failed:', e);
    }
    
    // Return success response (exclude sensitive data)
    return NextResponse.json(
      { 
        message: 'User created successfully',
        user: {
          id: directusRes.id,
          email: directusRes.email,
          first_name: directusRes.first_name,
          last_name: directusRes.last_name,
          phone: validatedData.phone_number,
        }
      },
      { status: 201 }
    )
    
  } catch (error) {
    console.error('Signup error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          message: 'Validation failed',
          errors: error.errors 
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
