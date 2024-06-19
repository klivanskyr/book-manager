import { NextRequest, NextResponse } from 'next/server';
import { auth } from './firebase/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export async function middleware(req: NextRequest) {

    onAuthStateChanged(auth, (user) => {
        if (user) {
            NextResponse.next()
        } else {
            const url = req.nextUrl.clone();
            url.pathname = '/login';
            return NextResponse.redirect(url, { status: 302, statusText: 'Not Authenticated' });
        }
    });
}

export const config = { // What paths need authentication
    matcher: ['/dashboard', '/_next' ]
}
