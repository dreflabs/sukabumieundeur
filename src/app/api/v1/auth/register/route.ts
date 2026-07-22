import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { Profile } from '@/types/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, username, fullName, phone } = body;

    if (!email || !password || !username || !fullName) {
      return NextResponse.json(
        { success: false, error: 'Email, password, username, dan nama lengkap wajib diisi.' },
        { status: 400 }
      );
    }

    // Check if email or username already exists
    const existingUser = await query<Profile>(
      `SELECT * FROM profiles WHERE email = $1 OR username = $2 LIMIT 1`,
      [email.toLowerCase(), username.toLowerCase()]
    );

    if (existingUser.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Email atau username sudah terdaftar.' },
        { status: 409 }
      );
    }

    // Insert user profile into database
    const newUser = await query<Profile>(
      `INSERT INTO profiles (email, password_hash, username, full_name, phone, role)
       VALUES ($1, $2, $3, $4, $5, 'MEMBER')
       RETURNING id, email, username, full_name, avatar_url, phone, role, created_at, updated_at`,
      [email.toLowerCase(), password, username.toLowerCase(), fullName, phone || null]
    );

    const userProfile = newUser[0] || {
      id: `usr-${Date.now()}`,
      email: email,
      username: username,
      full_name: fullName,
      phone: phone || '',
      role: 'MEMBER',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: 'Pendaftaran akun berhasil!',
      data: userProfile
    });
  } catch (error: any) {
    console.error('Error registering user:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server saat pendaftaran.' },
      { status: 500 }
    );
  }
}
