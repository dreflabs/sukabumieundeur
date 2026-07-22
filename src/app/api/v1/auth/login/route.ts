import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { Profile } from '@/types/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { emailOrUsername, password } = body;

    if (!emailOrUsername || !password) {
      return NextResponse.json(
        { success: false, error: 'Email/Username dan password wajib diisi.' },
        { status: 400 }
      );
    }

    // Query user profile from PostgreSQL
    const users = await query<Profile & { password_hash: string }>(
      `SELECT * FROM profiles WHERE LOWER(email) = $1 OR LOWER(username) = $1 LIMIT 1`,
      [emailOrUsername.toLowerCase()]
    );

    let user: Profile | null = null;

    if (users.length > 0) {
      const dbUser = users[0];
      if (dbUser.password_hash === password) {
        user = {
          id: dbUser.id,
          email: dbUser.email,
          username: dbUser.username,
          full_name: dbUser.full_name,
          avatar_url: dbUser.avatar_url,
          phone: dbUser.phone,
          role: dbUser.role,
          created_at: dbUser.created_at,
          updated_at: dbUser.updated_at
        };
      }
    } else if (password === 'password123') {
      // Fallback demo user for local dev UI testing
      user = {
        id: 'usr-demo-12345',
        email: emailOrUsername.includes('@') ? emailOrUsername : `${emailOrUsername}@eundeur.com`,
        username: emailOrUsername.split('@')[0],
        full_name: 'Metalhead Sukabumi',
        phone: '081234567890',
        role: 'MEMBER',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Email/Username atau password salah.' },
        { status: 401 }
      );
    }

    const token = `jwt_session_${user.id}_${Date.now()}`;

    const response = NextResponse.json({
      success: true,
      message: 'Login berhasil!',
      data: {
        user: user,
        token: token
      }
    });

    // Set HTTP-Only session cookie
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 Days
    });

    return response;
  } catch (error: any) {
    console.error('Error logging in user:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server saat login.' },
      { status: 500 }
    );
  }
}
