import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, handleNoToken, handleValidToken } from '@/utils/middlewareHelpers';

export async function middleware(req: NextRequest) {
    // console.log('\n\nMiddleware', req.nextUrl.pathname, req.nextUrl.searchParams);
    try {
        const cookie = req.cookies.get('token');

        if (!cookie) {
            console.log('No token found');
            return handleNoToken(req);
        } 

        const token = cookie.value;
        const { status, message, uid } = await verifyToken(token);
        // console.error('Token:', token, status, message, uid);
        if (status !== 200 || !uid) {
            // console.log('Token error:', message);
            return handleNoToken(req);
        }

        return handleValidToken(req, uid);

    } catch (error) {
        // console.error('Middleware error:', error);
        return NextResponse.json({ code: 500, message: `${error}` });
    }
}

export const config = {
    matcher: [
        '/login',
        '/explore',
        '/dashboard/:id*',
        '/profile/:id*/settings',
        '/api/auth/logout',
        '/api/auth/updateUser',
    ],
};
