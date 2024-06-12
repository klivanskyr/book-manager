import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(req: NextRequest) {
    console.log('checking auth for route', req.nextUrl.pathname);
    const path = req.nextUrl.pathname;
    if (path.startsWith('/api/sign-up') || path.startsWith('/login') || path.startsWith('/sign-up') || path.startsWith('/_next')) {
        return NextResponse.next();
    }

    if (!isAuthenticated(req)) {
        const url = req.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url, { status: 302, statusText: 'Not Authenticated' })
    }
}

function isAuthenticated(req: NextRequest) {
    const token = req.cookies.get('token');

    if (!token) {
        return false;
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET);
        return true;
    } catch (error) {
        return false;
    }
}

