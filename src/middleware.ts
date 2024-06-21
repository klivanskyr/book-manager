import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
    const cookie = req.cookies.get('token');

    if (!cookie) {
        return NextResponse.redirect(new URL('/login', req.nextUrl), { status: 302, statusText: 'Not Authenticated' })
    }

    const token = cookie.value;

    const res = await fetch('http://localhost:3000/api/auth/verify', {
        method: 'POST',
        cache: 'no-cache',
        headers: {
            'Cookie': `token=${token}`
        }
    });

    const data = await res.json();

    if (data.code !== 200) {
        return NextResponse.redirect(new URL('/login', req.nextUrl), { status: 302, statusText: 'Not Authenticated' })
    }
    
    if (req.nextUrl.pathname === '/login') {
        return NextResponse.redirect(new URL(`/dashboard/${data.jwt.userId}`, req.nextUrl), { status: 302, statusText: 'Authenticated' })
    }

    if (req.nextUrl.pathname.startsWith('/dashboard') && req.nextUrl.pathname !== `/dashboard/${data.jwt.userId}`) {
        return NextResponse.redirect(new URL('/login', req.nextUrl), { status: 302, statusText: 'Not Authenticated' })
    }

    return NextResponse.next();
}

export const config = { // What paths need authentication
    matcher: ['/dashboard/:id*'],
}