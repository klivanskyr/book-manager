import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
    console.log('Middleware:', req.nextUrl.pathname);
    try {
        const cookie = req.cookies.get('token');

        if (!cookie && req.nextUrl.pathname !== '/login') {
            return NextResponse.redirect(new URL('/login', req.nextUrl), { status: 302 });
        }

        if (!cookie && req.nextUrl.pathname === '/login') {
            return NextResponse.next();
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

        if (req.nextUrl.pathname === '/login') {
            return NextResponse.redirect(new URL(`/dashboard/${data.uid}`, req.nextUrl), { status: 302 });
        }

        if (req.nextUrl.pathname.startsWith('/dashboard') && req.nextUrl.pathname !== `/dashboard/${data.uid}`) {
            return NextResponse.redirect(new URL('/login', req.nextUrl), { status: 302 });
        }

        return NextResponse.next();
    } catch (error) {
        console.error('Middleware error:', error);
        return NextResponse.error();
    }
}

export const config = {
    matcher: ['/dashboard/:id*', '/login', '/api/auth/logout'],
};
