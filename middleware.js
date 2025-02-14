import { NextResponse } from 'next/server';

export function middleware(request) {
    const cookies = request.headers.get('cookie');
    const isAuthorized = cookies && cookies.includes('Authorization=');

    console.log("Cookies recebidos no middleware:", cookies);

    // Se o usuário tem o cookie de autorização e está na rota raiz, redireciona para /admin
    if (isAuthorized && request.nextUrl.pathname === '/') {
        return NextResponse.redirect(new URL('/admin', request.url));
    }

    // Se não tem o cookie de autorização e está nas rotas /admin, redireciona para a página inicial
    if (!isAuthorized && request.nextUrl.pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Continua a requisição normalmente para todas as outras rotas
    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/'], // Adicionamos a rota raiz para redirecionar caso tenha o cookie Authorization
};
