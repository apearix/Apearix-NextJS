import { NextResponse } from 'next/server';

interface CookieOptions {
  httpOnly?: boolean;
  path?: string;
  maxAge?: number;
  sameSite?: 'lax' | 'strict' | 'none';
  secure?: boolean;
}

export function setCookie(
  response: NextResponse,
  name: string,
  value: string,
  options: CookieOptions = {}
) {
  response.cookies.set({
    name,
    value,
    httpOnly: options.httpOnly ?? false,
    path: options.path ?? '/',
    maxAge: options.maxAge ??  60 * 60 * 24 * 3, // default 24 hours
    sameSite: options.sameSite ?? 'lax',
    secure: options.secure ?? (process.env.NODE_ENV === 'production'),
  });
}
