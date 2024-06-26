import { auth, database } from "@/firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, serverTimestamp, set } from "firebase/database";
import { NextRequest, NextResponse } from "next/server";

type CreatedWith = 'email' | 'google';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { username, email, password, createdWith }: { username: string, email: string, password: string, createdWith: CreatedWith } = body;

        if (!username || !email || !password || !createdWith) {
            return NextResponse.json({ code: 400, message: 'Missing parameters, requires username, email, password, createdWith' });
        }
        
        let uid = '';
        // Create user in Firebase Auth
        if (createdWith === 'email') {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                uid = userCredential.user.uid;
            } catch (error) {
                return NextResponse.json({ code: 500, message: `Error creating user: ${error}` });
            }
        }

        //Create user in database
        const userInfo = {
            username: username,
            email: email,
            createdWith: createdWith,
            createdAt: serverTimestamp()
        };

        if (uid) { //if uid was not set, there was an error creating the user
            console.log('Creating user:', userInfo)
            await set(ref(database, `users/${uid}`), userInfo);
            return NextResponse.json({ code: 200, message: 'success' });
        } else {
            console.log('Error creating user: uid undefined');
            return NextResponse.json({ code: 500, message: 'Error creating user: uid undefined' });
        }

    } catch (error) {
        return NextResponse.error();
    }
}