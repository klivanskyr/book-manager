import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
    try {
        const cookie = req.cookies.get('token');

        console.log('\nMiddleware:', req.nextUrl.pathname, cookie?.value);

        if (!cookie && req.nextUrl.pathname !== '/login') {
            return NextResponse.redirect(new URL('/login', req.nextUrl), { status: 302 });
        }

        if (!cookie && req.nextUrl.pathname === '/login') {
            return NextResponse.next();
        }

        const token = cookie?.value;

        console.log('Token:', token);

        const res = await fetch(`${process.env.API_DOMAIN}/api/auth/verify`, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Cookie': `token=${token}`
            }
        });

        if (!res.ok) {
            console.error('Error fetching auth verification:', res.statusText);
            return NextResponse.redirect(new URL('/login', req.nextUrl), { status: 302 });
        }

        const data = await res.json().catch(err => {
            console.error('Error parsing JSON:', err);
            throw new Error('Invalid JSON response');
        });

        if (data.code !== 200 && req.nextUrl.pathname !== '/login') {
            console.log('1');
            return NextResponse.redirect(new URL('/login', req.nextUrl), { status: 302 });
        }

        if (data.code !== 200 && req.nextUrl.pathname === '/login') {
            console.log('2');
            return NextResponse.next();
        }

        if (req.nextUrl.pathname === '/login') {
            console.log('3');
            return NextResponse.redirect(new URL(`/dashboard/${data.jwt.userId}`, req.nextUrl), { status: 302 });
        }

        if (req.nextUrl.pathname.startsWith('/dashboard') && req.nextUrl.pathname !== `/dashboard/${data.jwt.userId}`) {
            console.log('4');
            return NextResponse.redirect(new URL('/login', req.nextUrl), { status: 302 });
        }

        console.log('5')
        return NextResponse.next();
    } catch (error) {
        console.error('Middleware error:', error);
        return NextResponse.error();
    }
}

export const config = {
    matcher: ['/dashboard/:id*', '/login', '/api/auth/logout'],
};
