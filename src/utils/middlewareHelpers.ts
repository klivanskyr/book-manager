import { NextRequest, NextResponse } from "next/server";

/**
 * Take a token and verify it with the API
 * @param token The token to verify
 * @returns The status of the token and the user ID: Promise<{ status: number, uid: string }>
 */
export async function verifyToken(token: string): Promise<{ status: number, message: string, uid?: string }> {
    console.log('verifyToken url', `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/auth/verify`);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/api/auth/verify`, {
        method: 'POST',
        cache: 'no-cache',
        headers: {
            'Cookie': `token=${token}`
        }
    });
    console.log('verifyToken res', res);
    const data = await res.json();
    console.log('verifyToken data', data);
    return { status: data.code, message: data.message, uid: data?.uid };
}

/**
 * Handle the case where there is no token
 * @param request The request object
 * @returns The response object
 */
export async function handleNoToken(request: NextRequest): Promise<NextResponse> {
    const path = request.nextUrl.pathname;
    const searchParams = request.nextUrl.searchParams;
    
    // No token can go to login
    if (path.startsWith('/login')) {
        console.log('No token, going to login');
        return NextResponse.next();
    }

    // No token can go to explore only if there is no userId in the query
    if (path.startsWith('/explore') && !searchParams.has('userId')) {
        console.log('No token, going to explore');
        return NextResponse.next();
    }

    // No token can not go to explore with userId, redirect to login
    if (path.startsWith('/explore') && searchParams.has('userId')) {
        console.log('No token, attempting to go to explore with userId, redirecting to login');
        return NextResponse.redirect(new URL('/login', request.nextUrl), { status: 302 });
    }

    // No token can not go to a dashboard, redirect to login
    if (path.startsWith('/dashboard')) {
        console.log('No token, attempting to go to dashboard, redirecting to login');
        return NextResponse.redirect(new URL('/login', request.nextUrl), { status: 302 });
    }

    // No token can not go to api/auth/logout, return no access
    if (path.startsWith('/api/auth/logout')) {
        console.log('No token, attempting to logout, returning no access');
        return NextResponse.json({ message: 'No access' }, { status: 403 });
    }

    // No token can not go to api/auth/updateUser, return no access
    if (path.startsWith('/api/auth/updateUser')) {
        console.log('No token, attempting to update user, returning no access');
        return NextResponse.json({ message: 'No access' }, { status: 403 });
    }

    // No token can not go to profile/[userId]/settings, redirect to login
    if (path.startsWith('/profile') && path.endsWith('/settings')) {
        console.log('No token, attempting to go to settings, redirecting to login');
        return NextResponse.redirect(new URL('/login', request.nextUrl), { status: 302 });
    }

    // all other cases, allow the request to continue
    return NextResponse.next();
}

/**
 * Handle the case where the token is invalid
 * @param request The request object
 * @returns The response object
 */
export async function handleValidToken(request: NextRequest, userId: string): Promise<NextResponse> {
    const path = request.nextUrl.pathname;
    const searchParams = request.nextUrl.searchParams;

    // Valid token going to login redirect to explore?userId=uid
    if (path === '/login') {
        console.log('Valid token, going to login, redirecting to explore');
        return NextResponse.redirect(new URL(`/explore?userId=${userId}`, request.nextUrl), { status: 302 });
    }

    // Valid token going to explore without userId will be redirected to explore?userId=uid
    if (path === '/explore' && !searchParams.has('userId')) {
        console.log('Valid token, going to explore without userId, redirecting to explore with userId');
        return NextResponse.redirect(new URL(`/explore?userId=${userId}`, request.nextUrl), { status: 302 });
    }

    // Vluad token with userId going to explore?userId=uid will be allowed if userId matches
    if (path === '/explore' && searchParams.has('userId') && searchParams.get('userId') === userId) {
        console.log('Valid token, going to explore with userId, allowing');
        return NextResponse.next();
    }
    
    // Valid token going to explore?userId=uid will be redirected to login if userId does not match
    if (path === '/explore' && searchParams.has('userId') && searchParams.get('userId') !== userId) {
        console.log('Valid token, going to explore with different userId, redirecting to login');
        return NextResponse.redirect(new URL('/login', request.nextUrl), { status: 302 });
    }

    // Valid token going to dashboard/[userId]/... will be redirected to login if userId does not match
    if (path.startsWith('dashboard') && !path.startsWith(`/dashboard/${userId}`)) {
        console.log('Valid token, going to someone else\'s dashboard, redirecting to login');
        return NextResponse.redirect(new URL('/login', request.nextUrl), { status: 302 });
    }
    
    // all other cases, allow the request to continue
    return NextResponse.next();
}