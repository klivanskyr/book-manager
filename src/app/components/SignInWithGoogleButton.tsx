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
                    // console.log('No result', result);
                    return;
                }

                const credential = GoogleAuthProvider.credentialFromResult(result);
                if (!credential) {
                    // console.log('No credential');
                    return;
                }

                console.log('Sign in with Google successful');

                const authUser = result.user.providerData[0];
                //create user in database if needed
                const userRef = ref(database, `users`);
                const userQuery = query(userRef, orderByValue(),  equalTo(authUser.uid));
                const snapshot = await get(userQuery);
                
                // console.log('authUser', authUser);
                if (!snapshot.exists() && authUser.email) {
                    //console.log('creating new user in database', authUser.email);
                    await createNewUser(authUser.uid, authUser.displayName ? authUser.displayName : authUser.email, authUser.email, null); //set email to username, null password
                } 

                const userBooksRef = ref(database, `usersBooks/${authUser.uid}`);
                onValue(userBooksRef, async (userBooksSnapshot) => { //listens for realtime updates
                    const books = await loadBooks(userBooksSnapshot);
                    const updatedUser: User = {
                        user_id: authUser.uid,
                        books
                };
                console.log('updated user', updatedUser);
                setUser(updatedUser);
                });

                //create jwt token
                const res = await fetch(`/api/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: authUser.email, password: null })
                });
                // console.log('res', res);

                const data = await res.json();
                // console.log('data', data);
                if (data.code !== 200) {
                    console.log('Error creating JWT token:', data.message);
                    return;
                } else { 
                    console.log('JWT token created');
                    router.push(`/dashboard/${authUser.uid}`)
                }
            })
            .catch((error) => {
                console.log(error);
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