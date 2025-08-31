// middleware.js — desactivado temporalmente para permitir acceso libre
import { NextResponse } from 'next/server';

// Desactivar todas las rutas del middleware
export const config = { matcher: [] };

export function middleware() {
  return NextResponse.next();
}
