import { auth } from "@/firebase";
import { createNewUser, getUser, getUserByUsername } from "@/firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FirestoreError } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

type CreatedWith = 'email' | 'google';

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const { username, email, password, googleId, createdWith }: { username: string, email: string, password: string, googleId: string, createdWith: CreatedWith } = await req.json();

        // Check if the request body has the required fields
        if (!createdWith) {
            return NextResponse.json({ message: 'Missing createdWith' }, { status: 400 });
        }

        if (createdWith === 'email' && (!username || !email || !password)) {
            return NextResponse.json({ message: 'Created with email requires username, email and password' }, { status: 400 });
        }

        if (createdWith === 'google' && !googleId) {
            return NextResponse.json({ message: 'Created with google requires googleId' }, { status: 400 });
        }

        // Create a new user by email and password
        if (createdWith === 'email') { 
            try {
                // Check database for same username
                const user = await getUserByUsername(username);
                if (user) {
                    return NextResponse.json({ message: 'Username already exists' }, { status: 400 });
                }
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await createNewUser(userCredential.user.uid, username, email, createdWith);
                return NextResponse.json({ message: 'success' }, { status: 200 });
            } catch (error) {
                const errorMessage = (error as Error).message;
                return NextResponse.json({ message: errorMessage }, { status: 400 });
            }

        // Create a new user by google   
        } else if (createdWith === 'google') {
            try {
                const user = await getUserByUsername(username);
                if (user) {
                    return NextResponse.json({ message: 'Username already exists' }, { status: 400 });
                }
                await createNewUser(googleId, username, email, createdWith);
                return NextResponse.json({ message: 'success' }, { status: 200 });
            } catch (error) {
                const errorMessage = (error as Error).message;
                return NextResponse.json({ message: errorMessage }, { status: 400 });
            }

        // Return an error if the createdWith is invalid
        } else {
            return NextResponse.json({ message: 'Invalid createdWith' }, { status: 400 });
        }

    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}