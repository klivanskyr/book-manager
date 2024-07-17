'use client';

import { Button } from "@nextui-org/react";
import { GoogleAuthProvider, getRedirectResult, signInWithPopup, signInWithRedirect } from "firebase/auth";
import { auth } from "@/firebase";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { GoogleG } from "@/assets";
import { createNewUser, db } from "@/firebase/firestore";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function SignInWithGoogleButton() {
    const router = useRouter();

    const handleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');
        provider.setCustomParameters({
            prompt: 'select_account'
        });

        signInWithPopup(auth, provider)
        .then(async (result) => {
            console.log('result', result);
            if (!result.user) return console.error('Error signing in with Google: No user found');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                cache: 'no-cache',
                body: JSON.stringify({ createdWith: 'google', token: result.user.getIdToken() })
            });
            console.log('response', response);
            const data = await response.json();
            console.log('data', data);
            if (data.code !== 200) {
                console.error('Error logging in with Google:', data.message);
                return;
            }

            //create user in database if not exists
            const userDocs = await getDocs(query(collection(db, 'users'), where('uid', '==', result.user.uid)));
            if (userDocs.empty) {
                const successful = await createNewUser(result.user.uid, result.user.displayName || 'Display Name', result.user.email || 'Email', 'google', result.user.photoURL || '');
                if (!successful) {
                    console.error('Error creating user in database:', result.user.uid);
                    return;
                }
            }
            
            router.push(`/explore?userId=${result.user.uid}`);
        })
        .catch((error) => {
            console.error(`Error signing in with Google: ${error}`);
            return;
        });
    }

    return (
        <div>
            <Button className='bg-green-400 w-64 h-12 text-white text-base' endContent={<GoogleG />} onClick={handleSignIn}>Sign in with Google</Button>
        </div>
    )
}