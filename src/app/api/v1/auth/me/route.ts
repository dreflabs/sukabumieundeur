import { NextRequest, NextResponse } from 'next/server';
import { Profile } from '@/types/database';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Sesi login tidak ditemukan.' },
        { status: 401 }
      );
    }

    const mockProfile: Profile = {
      id: 'usr-demo-12345',
      email: 'metalhead@sukabumieundeur.com',
      username: 'metalhead_skbm',
      full_name: 'Sukabumi Underground Member',
      phone: '081234567890',
      role: 'MEMBER',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: mockProfile
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Gagal verifikasi sesi pengguna.' },
      { status: 500 }
    );
  }
}
