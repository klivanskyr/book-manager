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
        })
        .catch((error) => {
            console.error('Error signing in with Google:', error);
            return;
        });
    }, []);

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