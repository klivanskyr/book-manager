import { NextRequest, NextResponse } from 'next/server';
import { auth } from './firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export async function middleware(req: NextRequest) {
    // Wrap the logic in a Promise to handle the asynchronous onAuthStateChanged
    await new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                if (req.url.startsWith(`/dashboard/${user.uid}`)) {
                    resolve(NextResponse.next());
                } else {
                    const url = new URL('/login', req.nextUrl.origin);
                    resolve(NextResponse.redirect(url.toString(), { status: 302, statusText: 'Not Authenticated' }));
                }
            } else {
                // If user is not authenticated, redirect to /login
                const url = new URL('/login', req.nextUrl.origin);
                resolve(NextResponse.redirect(url.toString(), { status: 302, statusText: 'Not Authenticated' }));
            }
        });
    });
}

export const config = {
    matcher: "/dashboard"
}
