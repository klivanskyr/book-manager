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
    });

    const data = await res.json();

    console.log(data);

    if (data.code !== 200) {
        return NextResponse.redirect(new URL('/login', req.nextUrl), { status: 302, statusText: 'Not Authenticated' })
    }
    
    if (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === `/dashboard/${data.uid.userId}`) {
        return NextResponse.redirect(new URL(`/dashboard/${data.uid.userId}`), { status: 302, statusText: 'Authenticated' })
    } else {
        return NextResponse.redirect(new URL('/login', req.nextUrl), { status: 302, statusText: 'Not Authenticated' })
    }
}

export const config = { // What paths need authentication
    matcher: ['/dashboard/:id*'],
}