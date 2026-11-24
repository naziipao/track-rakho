import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const COOKIE_NAME = 'trackrakho_session';
const SESSION_DURATION_SECONDS = 60 * 60; // 1 hour (e.g., 60 * 30 for 30 mins)

function signTimestamp(expiresAt: number, secret: string) {
  const hmac = crypto.createHmac('sha256', secret).update(String(expiresAt)).digest('hex');
  return `${expiresAt}.${hmac}`;
}

function verifyToken(token: string | undefined, secret: string): boolean {
  if (!token) return false;
  const [expiresStr, signature] = token.split('.');
  const expiresAt = Number(expiresStr);
  if (!expiresAt || !signature || Date.now() > expiresAt) return false;

  const expected = crypto.createHmac('sha256', secret).update(expiresStr).digest('hex');
  return signature === expected;
}

// GET: Check if the current 1-hour session is still valid
export async function GET(req: NextRequest) {
  const secret = process.env.APP_PIN || '1234';
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const authenticated = verifyToken(token, secret);

  return NextResponse.json({ authenticated });
}

// POST: Verify PIN on the server and start a 1-hour session
export async function POST(req: NextRequest) {
  const secret = process.env.APP_PIN || '1234';
  const { pin } = await req.json();

  if (String(pin) !== String(secret)) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const expiresAt = Date.now() + SESSION_DURATION_SECONDS * 1000;
  const token = signTimestamp(expiresAt, secret);

  const res = NextResponse.json({ authenticated: true, expiresAt });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DURATION_SECONDS,
  });

  return res;
}

// DELETE: Manual lock / logout
export async function DELETE() {
  const res = NextResponse.json({ authenticated: false });
  res.cookies.delete(COOKIE_NAME);
  return res;
}