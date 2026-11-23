import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Nativa Edge Middleware
 * Protege las rutas administrativas (/admin y /admin/company/*)
 * Asegurando que solo usuarios autenticados con rol de administrador tengan acceso.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Interceptar rutas de administración
  if (pathname.startsWith('/admin')) {
    const adminSessionCookie = request.cookies.get('nativa_admin_session')?.value;

    // Si no tiene el cookie de sesión de administrador autenticado
    if (!adminSessionCookie || adminSessionCookie !== 'true') {
      const redirectUrl = new URL('/', request.url);
      redirectUrl.searchParams.set('error', 'unauthorized_admin');
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
