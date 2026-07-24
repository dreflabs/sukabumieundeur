import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Check against database profiles
    const profiles = await query<any>(
      `SELECT id, email, username, password_hash, role 
       FROM public.profiles 
       WHERE email = $1 AND role IN ('SUPER_ADMIN', 'MODULE_ADMIN', 'ORGANISER')`,
      [email]
    );

    if (profiles.length === 0) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials or unauthorized role" },
        { status: 401 }
      );
    }

    const adminUser = profiles[0];
    
    // Compare password hash
    const isMatch = await bcrypt.compare(password, adminUser.password_hash);
    
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      return NextResponse.json(
        { success: false, message: "Internal Server Error: Missing Auth Configuration" },
        { status: 500 }
      );
    }
    const secret = new TextEncoder().encode(JWT_SECRET);
    
    // Generate RBAC JWT (with consistent structure)
    const jwt = await new SignJWT({ 
      userId: adminUser.id, // For backwards compatibility with existing helpers
      id: adminUser.id,
      email: adminUser.email,
      username: adminUser.username,
      role: adminUser.role 
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secret);

    // Create a response
    const response = NextResponse.json(
      { success: true, message: "Authentication successful" },
      { status: 200 }
    );

    // Set cookie
    response.cookies.set({
      name: 'eundeur_admin_session',
      value: jwt,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return response;

  } catch (error) {
    console.error('Admin Login Error:', error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
