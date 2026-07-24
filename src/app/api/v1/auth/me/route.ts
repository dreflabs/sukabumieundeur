import { NextRequest, NextResponse } from 'next/server';
import { Profile } from '@/types/database';
import { verifyUserSession } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await verifyUserSession();

    if (!session || !session.id) {
      return NextResponse.json(
        { success: false, error: 'Sesi login tidak ditemukan.' },
        { status: 401 }
      );
    }

    const profiles = await query<Profile>(
      `SELECT id, email, username, full_name, phone, role, created_at, updated_at 
       FROM profiles WHERE id = $1`,
      [session.id]
    );

    if (profiles.length === 0) {
      return NextResponse.json({ success: false, error: 'Profil tidak ditemukan.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: profiles[0]
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Gagal verifikasi sesi pengguna.' },
      { status: 500 }
    );
  }
}
