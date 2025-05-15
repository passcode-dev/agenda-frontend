import { NextResponse } from 'next/server';

export function middleware(request) {
    const cookieHeader = request.headers.get('cookie') || '';
    const cookies = Object.fromEntries(cookieHeader.split('; ').map(cookie => {
        const [key, value] = cookie.split('=');
        return [key, value];
    }));

    const isAuthorized = Boolean(cookies.Authorization);
    const role = cookies.role;

    console.log("Cookies recebidos no middleware:", cookies);

    if (isAuthorized && request.nextUrl.pathname === '/') {
        return NextResponse.redirect(new URL('/admin', request.url));
    }

    if (!isAuthorized && request.nextUrl.pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    if (role === 'teacher' && request.nextUrl.pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/teacher', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/'],
};
