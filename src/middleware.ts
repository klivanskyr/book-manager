import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
    try {
        const cookie = req.cookies.get('token');

        if (!cookie && req.nextUrl.pathname !== '/login') {
            return NextResponse.redirect(new URL('/login', req.nextUrl), { status: 302, statusText: 'Not Authenticated' })
        }

        if (!cookie && req.nextUrl.pathname === '/login') {
            return NextResponse.next();
        }

        const token = cookie?.value;

        const res = await fetch('http://localhost:3000/api/auth/verify', {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Cookie': `token=${token}`
            }
        });

        const data = await res.json();

        if (data.code !== 200 && req.nextUrl.pathname !== '/login') {
            return NextResponse.redirect(new URL('/login', req.nextUrl), { status: 302, statusText: 'Not Authenticated' })
        }

        if (data.code !== 200 && req.nextUrl.pathname === '/login') {
            return NextResponse.next();
        }

        if (req.nextUrl.pathname === '/login') {
            return NextResponse.redirect(new URL(`/dashboard/${data.jwt.userId}`, req.nextUrl), { status: 302, statusText: 'Authenticated' })
        }

        if (req.nextUrl.pathname.startsWith('/dashboard') && req.nextUrl.pathname !== `/dashboard/${data.jwt.userId}`) {
            return NextResponse.redirect(new URL('/login', req.nextUrl), { status: 302, statusText: 'Not Authenticated' })
        }

        return NextResponse.next();
    } catch (error) {
        return NextResponse.error();
    }
}

export const config = { // What paths need authentication
    matcher: ['/dashboard/:id*', '/login', '/api/auth/logout'],
}