import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { Profile } from '@/types/database';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, username, fullName, phone } = body;

    if (!email || !password || !username || !fullName) {
      return NextResponse.json(
        { success: false, error: 'Semua kolom wajib diisi.' },
        { status: 400 }
      );
    }

    // Password strength validation
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        { success: false, error: 'Pendaftaran gagal, periksa kembali data Anda.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanUsername = username.toLowerCase().trim();

    // Check if email or username already exists
    const existingUser = await query<Profile>(
      `SELECT id FROM profiles WHERE email = $1 OR username = $2 LIMIT 1`,
      [cleanEmail, cleanUsername]
    );

    if (existingUser.length > 0) {
      // Prevent enumeration by returning a generic error instead of "already exists"
      return NextResponse.json(
        { success: false, error: 'Pendaftaran gagal, periksa kembali data Anda.' },
        { status: 400 }
      );
    }

    // Hash the password securely
    const saltRounds = 10;
    const passwordHash = bcrypt.hashSync(password, saltRounds);

    // Insert user profile into database
    const newUser = await query<Profile>(
      `INSERT INTO profiles (email, password_hash, username, full_name, phone, role)
       VALUES ($1, $2, $3, $4, $5, 'MEMBER')
       RETURNING id, email, username, full_name, avatar_url, phone, role, created_at, updated_at`,
      [cleanEmail, passwordHash, cleanUsername, fullName, phone || null]
    );

    const userProfile = newUser[0];

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
