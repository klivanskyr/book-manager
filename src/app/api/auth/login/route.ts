import { NextRequest, NextResponse } from "next/server";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firestore";

type CreatedWith = 'email' | 'google';

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const { email, password, token, createdWith }: { email: string, password: string, token: string, createdWith: CreatedWith } = await req.json();

        if (!email || !createdWith) { //password is optional for google sign in, token only need for google sign in
            return NextResponse.json({ code: 400, message: "Missing parameters, requires email, password" });
        }

        if (createdWith === 'email') {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);

            if (!userCredential) {
                return NextResponse.json({ code: 400, message: 'User not found' });
            }

            const token = await userCredential.user.getIdToken();
            const response = NextResponse.json({ code: 200, message: 'User logged in', uid: userCredential.user.uid });
            response.cookies.set('token', token);
            return response;

        } else if (createdWith === 'google') {
            //When logging in with google, the user is automatically signed in auth
            const response = NextResponse.json({ code: 200, message: 'User logged in' })
            response.cookies.set('token', token);
            return response;
            
        } else {
            return NextResponse.json({ code: 400, message: 'Invalid createdWith parameter' });
        }
    
    } catch (error) {
        return NextResponse.json({ code: 500, message: "Internal Server Error" })
    }
}