'use client';

import { Button } from "@nextui-org/react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/firebase";
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
            if (!result.user) return console.error('Error signing in with Google: No user found');
            const userInfo = result.user.providerData[0]
            const userId = result.user.uid;
            const userToken = await result.user.getIdToken();
            // console.log('userInfo', userInfo);
            // console.log('userId', userId);
            // console.log('userToken', userToken);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                cache: 'no-cache',
                body: JSON.stringify({ email: userInfo.email, createdWith: 'google', token: userToken })
            });
            // console.log('response', response);
            const data = await response.json();
            // console.log('data', data);
            if (data.code !== 200) {
                console.error('Error logging in with Google:', data.message);
                return;
            }

            //create user in database if not exists
            const userDocs = await getDocs(query(collection(db, 'users'), where('uid', '==', result.user.uid)));
            if (userDocs.empty) {
                const successful = await createNewUser(userId, userInfo.displayName || 'TEMP DISPLAY NAME', userInfo.email || 'TEMP EMAIL', 'google', userInfo.photoURL || '');
                if (!successful) {
                    console.error('Error creating user in database:', userId);
                    return;
                } else {
                    console.log('User created in database:', userId);
                }
            }
            console.log('google user pushing to explore');
            router.push(`/explore?userId=${userId}`);
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