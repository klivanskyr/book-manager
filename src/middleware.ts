import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(req: NextRequest) {

    if (!isAuthenticated(req)) {
        const url = req.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url, { status: 302, statusText: 'Not Authenticated' })
    }
}

export const config = { // What paths need authentication
    matcher: ['/api/auth/logout', '/api/books', '/dashboard', '/_next' ],
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

