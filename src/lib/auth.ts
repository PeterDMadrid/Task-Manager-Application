import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET!;

interface JWTPayload {
  userId: number;
  exp: number;
}

interface CurrentUser {
  userId: number;
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

export function createToken(userId: number): string {
  const payload: JWTPayload = {
    userId: userId,
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
  };

  return jwt.sign(payload, JWT_SECRET);
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    console.log('Token verification failed:', error);
    return null;
  }
}

export async function getCurrentUser(request: NextRequest): Promise<CurrentUser | null> {
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    console.log('No auth token found in cookies');
    return null;
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    console.log('Token verification failed');
    return null;
  }

  return { userId: decoded.userId };
}

export async function getCurrentUserFromCookies(): Promise<CurrentUser | null> {
  try {
    const cookieStore = await cookies(); 
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      console.log('No auth token found in cookies');
      return null;
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      console.log('Token verification failed');
      return null;
    }

    return { userId: decoded.userId };
  } catch (error) {
    console.error('Error getting current user from cookies:', error);
    return null;
  }
}


export function createAuthResponse(token: string, data: any) {
  const response = new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const cookieOptions = [
    `auth-token=${token}`,
    'HttpOnly',
    'SameSite=Lax',
    'Path=/',
    `Max-Age=${24 * 60 * 60}`,

    ...(process.env.NODE_ENV === 'production' ? ['Secure'] : [])
  ].join('; ');

  response.headers.set('Set-Cookie', cookieOptions);
  return response;
}

export function createLogoutResponse() {
  const response = new Response(
    JSON.stringify({ message: 'Logout successful' }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  );

  response.headers.set(
    'Set-Cookie',
    'auth-token=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0'
  );

  return response;
}
