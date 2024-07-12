import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
    try {
        const cookie = req.cookies.get('token');

        if (!cookie && req.nextUrl.pathname === '/login' || !cookie && req.nextUrl.pathname === '/explore') {
            return NextResponse.next();
        }

        if (!cookie && req.nextUrl.pathname !== '/login') {
            return NextResponse.redirect(new URL('/login', req.nextUrl), { status: 302 });
        }

        const token = cookie?.value;

        const res = await fetch(`${process.env.API_DOMAIN}/api/auth/verify`, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Cookie': `token=${token}`
            }
        });

        const data = await res.json();
        if (data.code !== 200 && req.nextUrl.pathname !== '/login') {
            return NextResponse.redirect(new URL('/login', req.nextUrl), { status: 302 });
        }

        if (data.code !== 200 && req.nextUrl.pathname === '/login') {
            return NextResponse.next();
        }

        if (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/explore') { // redirects authenticated users to explore/uid
            return NextResponse.redirect(new URL(`/explore/${data.uid}`, req.nextUrl), { status: 302 });
        }

        if (req.nextUrl.pathname.startsWith('/dashboard') && !req.nextUrl.pathname.startsWith(`/dashboard/${data.uid}`)) {
            return NextResponse.redirect(new URL('/login', req.nextUrl), { status: 302 });
        }

        return NextResponse.next();
    } catch (error) {
        console.error('Middleware error:', error);
        return NextResponse.error();
    }
}

export const config = {
    matcher: ['/dashboard/:id*', '/login', '/api/auth/logout', '/explore'],
};
