import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
    const cookie = req.cookies.get('token');

    if (!cookie) {
        const url = req.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url, { status: 302, statusText: 'Not Authenticated' })
    }

    const token = cookie.value;

    const res = await fetch('http://localhost:3000/api/auth/verify', {
        method: 'POST',
        cache: 'no-cache',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
    });

    const data = await res.json();

    if (data.code !== 200) {
        const url = req.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url, { status: 302, statusText: 'Not Authenticated' })
    }

    return NextResponse.next()
}

export const config = { // What paths need authentication
    matcher: ['/api/auth/logout', '/api/books', '/dashboard', '/_next' ],
}
