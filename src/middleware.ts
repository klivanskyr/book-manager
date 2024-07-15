import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
    try {
        const cookie = req.cookies.get('token');

        // No token can go to login or explore
        if (!cookie && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/explore')) {
            return NextResponse.next();
        }

        // No token cannot go to dashboard or api/auth/logout, redirect to login
        if (!cookie && req.nextUrl.pathname !== '/login') {
            return NextResponse.redirect(new URL('/login', req.nextUrl), { status: 302 });
        }

        const res = await fetch(`${process.env.API_DOMAIN}/api/auth/verify`, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Cookie': `token=${cookie?.value}`
            }
        });

        const data = await res.json();

        // Invalid token can go to login or explore
        if (data.code !== 200 && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/explore')) {
            return NextResponse.next();
        }

        //invalid token going to a dashboard will be redirected to login
        if (data.code !== 200 && req.nextUrl.pathname.startsWith('/dashboard')) {
            return NextResponse.redirect(new URL('/login', req.nextUrl), { status: 302 });
        }

        // Invalid token cannot go to explore?userId=uid, redirect to login
        if (data.code !== 200 && req.nextUrl.pathname.startsWith('/explore') && req.nextUrl.searchParams.has('userId')) {
            return NextResponse.redirect(new URL('/login', req.nextUrl), { status: 302 });
        }

        // Valid token can skip login and go to their specific explore page
        if (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/explore') { // redirects authenticated users to explore/uid
            return NextResponse.redirect(new URL(`/explore/${data.uid}`, req.nextUrl), { status: 302 });
        }

        // Valid tokens going to someone else's dashboard will be redirected to login (which then would go to their explore page)
        if (req.nextUrl.pathname.startsWith('/dashboard') && !req.nextUrl.pathname.startsWith(`/dashboard/${data.uid}`)) {
            return NextResponse.redirect(new URL('/login', req.nextUrl), { status: 302 });
        }

        // Valid tokens going to someone else's explore will be redirected to login (which then would go to their explore page)
        if (req.nextUrl.pathname.startsWith('/explore') && req.nextUrl.searchParams.has('userId') && req.nextUrl.searchParams.get('userId') !== data.uid) {
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
