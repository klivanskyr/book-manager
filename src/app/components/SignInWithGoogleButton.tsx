'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { getRedirectResult } from "firebase/auth";
import { auth } from "@/firebase/firestore";

import { User, UserContext } from "@/app/types/UserContext";
import { loadBooks } from "@/app/db";
import { Button } from '@nextui-org/react';
import { googleG } from '@/assets';
import Image from 'next/image';
import { signInWithGoogle } from '../db/auth';

export default function SignInWithGoogleButton({ className='', disabled = false }: { className?: string, disabled?: boolean }) {
    const { user, setUser } = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        getRedirectResult(auth)
        .then(async (result) => {
            //console.log('Result:', result);
        })
        .catch((error) => {
            console.error('Error signing in with Google:', error);
            return;
        });
    }, []);

    const handlePress = async () => {
        setIsLoading(true);
        //console.log('Signing in with Google')
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

/*
            .then(async (result) => {
                if (!result) {
                    //console.log('No result from Google Sign In');
                    return;
                }

                const authUser = result.user.providerData[0];
                const token = result.user.getIdToken();

                //create user in database if needed
                const userRef = ref(database, `users`);
                const userQuery = query(userRef, orderByValue(),  equalTo(authUser.uid));
                const snapshot = await get(userQuery);
                
                if (!snapshot.exists() && authUser.email) {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/api/auth/sign-up`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ username: authUser.displayName, email: authUser.email, uid: authUser.uid, createdWith: 'google' })
                    });
                } 

                //sets token in cookie
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/api/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: authUser.email, token: token, createdWith: 'google' })
                });

                if (res.status !== 200) {
                    console.error('Error logging in with Google:', res.statusText);
                    return;
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
            })
            .catch((error) => {
                console.error('Error signing in with Google:', error);
                return;
            });
            */