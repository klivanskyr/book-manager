'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { ref, onValue, query, orderByValue, equalTo, get, set } from 'firebase/database';
import { GoogleAuthProvider, getRedirectResult } from "firebase/auth";
import { database, auth } from "@/firebase/firebase";

import { User, UserContext } from "@/app/types/UserContext";
import { createNewUser, loadBooks } from "@/app/db";
import { Button } from '@nextui-org/react';
import { googleG } from '@/assets';
import Image from 'next/image';
import { signInWithGoogle } from '../db/auth';

export default function SignInWithGoogleButton({ className='', disabled = false }: { className?: string, disabled?: boolean }) {
    const { user, setUser } = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const googleSignInResult = async () => {
            getRedirectResult(auth)
            .then(async (result) => {
                if (!result) {
                    return;
                }

                const credential = GoogleAuthProvider.credentialFromResult(result);
                if (!credential) {
                    return;
                }

                const authUser = result.user.providerData[0];
                //create user in database if needed
                const userRef = ref(database, `users`);
                const userQuery = query(userRef, orderByValue(),  equalTo(authUser.uid));
                const snapshot = await get(userQuery);
                
                if (!snapshot.exists() && authUser.email) {
                    await createNewUser(authUser.uid, authUser.displayName ? authUser.displayName : authUser.email, authUser.email, null); //set email to username, null password
                } 

                const userBooksRef = ref(database, `usersBooks/${authUser.uid}`);
                onValue(userBooksRef, async (userBooksSnapshot) => { //listens for realtime updates
                    const books = await loadBooks(userBooksSnapshot);
                    const updatedUser: User = {
                        user_id: authUser.uid,
                        books
                };
                setUser(updatedUser);
                });

                //create jwt token
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/api/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: authUser.email, password: null })
                });

                const data = await res.json();
                if (data.code !== 200) {
                    return;
                } else { 
                    router.push(`/dashboard/${authUser.uid}`)
                }
            })
            .catch((error) => {
                return;
            });
        }

        googleSignInResult();
        setIsLoading(false);

    }, [router]);

    const handlePress = async () => {
        setIsLoading(true);
        await signInWithGoogle();
    }

    return (
        <Button
            color='primary'
            type='submit'
            className={className}
            size='lg'
            onPress={() => handlePress()}
            disabled={disabled}
            isLoading={isLoading}
        >
            Sign in with Google <Image src={googleG} alt='Google Icon' height={30} width={30} />
        </Button>
    )
}