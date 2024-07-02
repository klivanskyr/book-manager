import { auth } from "@/firebase";
import { createNewUser } from "@/firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { NextRequest, NextResponse } from "next/server";

type CreatedWith = 'email' | 'google';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { username, email, password, googleId, createdWith }: { username: string, email: string, password: string, googleId: string, createdWith: CreatedWith } = body;

        if (!createdWith) {
            return NextResponse.json({ message: 'Missing createdWith' }, { status: 400 });
        } else if (createdWith === 'email' && (!username || !email || !password)) {
            return NextResponse.json({ message: 'Created with email requires username, email and password' }, { status: 400 });
        } else if (createdWith === 'google' && !googleId) {
            return NextResponse.json({ message: 'Created with google requires googleId' }, { status: 400 });
        }

        if (createdWith === 'email') { 
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await createNewUser(userCredential.user.uid, username, email, createdWith);
        } else if (createdWith === 'google') {
            await createNewUser(googleId, username, email, createdWith)
        } 

        return NextResponse.json({ message: 'success' }, { status: 200 });  

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}