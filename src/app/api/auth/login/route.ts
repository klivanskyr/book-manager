import { NextRequest, NextResponse } from "next/server";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebase";

type CreatedWith = 'email' | 'google';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password, token, createdWith }: { email: string, password: string, token: string, createdWith: CreatedWith }= body;

        if (email === undefined || createdWith === undefined) { //password is optional for google sign in, token only need for google sign in
            return NextResponse.json({ code: 400, message: "Missing parameters, requires email, password" });
        }

        if (createdWith === 'email') {
            signInWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                const token = await userCredential.user.getIdToken();
                return NextResponse.json({ code: 200, message: 'User logged in', uid: userCredential.user.uid }).cookies.set('token', token);
            })
            .catch((error) => {
                return NextResponse.json({ code: 400, message: error.message });
            });

        } else if (createdWith === 'google') {
            //When logging in with google, the user is automatically signed in auth
            return NextResponse.json({ code: 200, message: 'User logged in' }).cookies.set('token', token);
        }
    
    } catch (error) {
        return NextResponse.error();
    }
}