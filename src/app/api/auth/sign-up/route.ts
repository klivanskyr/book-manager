import { auth, database } from "@/firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, serverTimestamp, set } from "firebase/database";
import { NextRequest, NextResponse } from "next/server";

type CreatedWith = 'email' | 'google';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { username, email, password, uid, createdWith }: { username: string, email: string, password: string, uid: string, createdWith: CreatedWith } = body;

        if (!username || !email || !createdWith) { //password is not required for google sign-in
            return NextResponse.json({ code: 400, message: 'Missing parameters, requires username, email, createdWith' });
        }
        
        // Create user in Firebase Auth
        if (createdWith === 'email') {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);

                //Create user in database
                const userInfo = {
                    username: username,
                    email: email,
                    createdWith: createdWith,
                    createdAt: serverTimestamp()
                };

                await set(ref(database, `users/${userCredential.user.uid}`), userInfo);
                return NextResponse.json({ code: 200, message: 'success' });

            } catch (error) {
                return NextResponse.json({ code: 500, message: `Error creating user: ${error}` });
            }
        } else if (createdWith === 'google') {
            //When loging in with google, the user is automatically created in in auth

            //Create user in database
            const userInfo = {
                username: username,
                email: email,
                createdWith: createdWith,
                createdAt: serverTimestamp()
            };

            await set(ref(database, `users/${uid}`), userInfo);
            return NextResponse.json({ code: 200, message: 'success' });
        }

    } catch (error) {
        return NextResponse.error();
    }
}