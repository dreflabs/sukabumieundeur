import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { NextResponse } from 'next/server';

export async function requireAdminRole(allowedRoles: string[]) {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('eundeur_admin_session');

  if (!authCookie || !authCookie.value) {
    return { success: false, response: NextResponse.json({ success: false, error: 'Unauthorized: No token provided' }, { status: 401 }) };
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      return { success: false, response: NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 }) };
    }

    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(authCookie.value, secret);
    
    if (!payload || !payload.role || !allowedRoles.includes(payload.role as string)) {
      return { success: false, response: NextResponse.json({ success: false, error: 'Forbidden: Insufficient privileges' }, { status: 403 }) };
    }

    return { success: true, payload };
  } catch (error) {
    return { success: false, response: NextResponse.json({ success: false, error: 'Unauthorized: Invalid token' }, { status: 401 }) };
  }
}
