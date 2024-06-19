'use client';

import { useContext } from 'react';
import { useRouter } from 'next/navigation';

import { ref, onValue, query, orderByValue, equalTo, get } from 'firebase/database';
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { database, auth } from "@/firebase/firebase";

import { User, UserContext } from "@/app/types/UserContext";
import { createNewUser, loadBooks } from "@/app/db";
import { Button } from '@nextui-org/react';
import { googleG } from '@/assets';
import Image from 'next/image';

export default function SignInWithGoogleButton({ className='', disabled = false }: { className: string, disabled?: boolean }) {
    const { user, setUser } = useContext(UserContext);
    const router = useRouter();

    function handlePress() {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({
            prompt: 'select_account',
            display: 'popup'
        });
        signInWithPopup(auth, provider)
            .then(async (result) => {
                console.log('result', result);
                const credential = GoogleAuthProvider.credentialFromResult(result);
                if (!credential) {
                    console.log('Error signing in with Google: no credential');
                    return;
                }
                const authUser = result.user;

                //create user in database if needed
                const userRef = ref(database, `users`);
                const userQuery = query(userRef, orderByValue(),  equalTo(authUser.uid));
                const snapshot = await get(userQuery);

                console.log('snapshot', snapshot);

                if (!snapshot.exists() && authUser.email) {
                    console.log('creating new user in database', authUser.email);
                    await createNewUser(authUser.uid, authUser.displayName ? authUser.displayName : authUser.email, authUser.email, null); //set email to username, no password
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
                router.push(`/dashboard/${updatedUser.user_id}`);
                return;
            });
                
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.email;
                const credential = GoogleAuthProvider.credentialFromError(error);
                console.log('Error signing in with Google: ', error);
            });
    }

    return (
        <Button
            color='primary'
            type='submit'
            className={className}
            size='lg'
            onPress={() => handlePress()}
            disabled={disabled}
        >
            Sign in with Google <Image src={googleG} alt='Google Icon' height={30} width={30} />
        </Button>
    )
    



}