import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { Profile } from '@/types/database';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { identifier, password } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, error: 'Email/Username dan password wajib diisi.' },
        { status: 400 }
      );
    }

    const cleanIdentifier = identifier.toLowerCase().trim();

    // Check if user exists by email or username
    const existingUsers = await query<Profile & { password_hash: string }>(
      `SELECT * FROM profiles WHERE email = $1 OR username = $1 LIMIT 1`,
      [cleanIdentifier]
    );

    if (existingUsers.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Kredensial tidak valid.' },
        { status: 401 }
      );
    }

    const user = existingUsers[0];

    // Verify password against hash
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Kredensial tidak valid.' },
        { status: 401 }
      );
    }

    // Generate JWT
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return NextResponse.json(
        { success: false, error: 'Internal Server Error: Missing Auth Configuration' },
        { status: 500 }
      );
    }
    const secret = new TextEncoder().encode(jwtSecret);
    const token = await new SignJWT({
        userId: user.id, // for consistency with admin JWT
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role
      })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secret);

    // Set HTTP-Only Cookie using Next.js native API
    const cookieStore = await cookies();
    cookieStore.set('sukabumi_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    // Remove password_hash from response
    const { password_hash, ...userProfile } = user;

    return NextResponse.json({
      success: true,
      message: 'Login berhasil!',
      data: userProfile
    });

  } catch (error: any) {
    console.error('Error logging in user:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server saat login.' },
      { status: 500 }
    );
  }
}
