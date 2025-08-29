import { NextResponse } from 'next/server';

export const config = { matcher: ['/app/:path*'] };

export function middleware(req) {
  const url = req.nextUrl;
  const token = req.cookies.get('nl_token');
  if (token?.value === 'ok') return NextResponse.next();
  url.pathname = '/beta/';
  return NextResponse.redirect(url);
}

