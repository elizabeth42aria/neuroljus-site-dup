import { cookies } from 'next/headers';

export async function POST() {
  cookies().set('nl_token', 'ok', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 // 1 hour
  });
  return new Response('OK', { status: 200 });
}

