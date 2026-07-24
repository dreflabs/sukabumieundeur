import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function verifyServerActionAuth(allowedRoles?: string[]) {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("eundeur_admin_session");

  if (!authCookie || !authCookie.value) {
    throw new Error("Unauthorized");
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(authCookie.value, secret);
    
    const userRole = payload.role as string;
    if (allowedRoles && !allowedRoles.includes(userRole)) {
      throw new Error("Forbidden: Insufficient role");
    }
    
    return payload as { userId: string; id: string; email: string; username: string; role: string };
  } catch (err) {
    throw new Error("Unauthorized");
  }
}

export async function getServerActionAuthOrNull(allowedRoles?: string[]) {
  try {
    return await verifyServerActionAuth(allowedRoles);
  } catch {
    return null;
  }
}

export async function verifyUserSession() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("sukabumi_session");

  if (!authCookie || !authCookie.value) {
    throw new Error("Unauthorized");
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(authCookie.value, secret);
    return payload as { userId: string; id: string; email: string; username: string; role: string };
  } catch (err) {
    throw new Error("Unauthorized");
  }
}

export async function getUserSessionOrNull() {
  try {
    return await verifyUserSession();
  } catch {
    return null;
  }
}
