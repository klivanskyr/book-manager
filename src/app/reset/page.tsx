'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { ActionButton, EmailInput, Form, LoadingButton } from "@/app/components";
import { Link } from '@nextui-org/react';
import emailIsValid from '@/app/utils/emailIsValid';
import { confirmPasswordReset, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/firebase/firebase';
import { getUserByEmail } from '../db';

export default function Reset() {
    const [email, setEmail] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();


    const passwordReset = async () => {
        sendPasswordResetEmail(auth, email)
        .then(() => {
            setIsLoading(false);
            setSuccess('Password reset email sent. Redirecting to login page in 5 seconds');
            setTimeout(() => {
                router.push('/login');
            }, 5000);
        })
        .catch((error) => {
            setError(error.message);
            setEmail('');
            setIsLoading(false);
        });
    }

    const handleSubmit = async () => {
        setIsLoading(true);
        if (!email) {
            setIsLoading(false);
            setError('Email is required');
            return;
        }
        if (!emailIsValid(email)) {
            setIsLoading(false);
            setError('Invalid email formation');
            setEmail('');
            return;
        }

        //check database for email
        const res = await getUserByEmail(email)

        if (!res) {
            setIsLoading(false);
            setError('Email not found');
            setEmail('');
            return;
        }

        await passwordReset();
    }

    function SubmitButton() {
        const className = 'mt-1 mb-2 w-64 h-12';
        return isLoading 
          ? <LoadingButton className={className} color="primary" isLoading={isLoading} /> 
          : <ActionButton className={className} disabled={isLoading} text='Sign In' onClick={handleSubmit} />
      }

    const formElements = [
        <h1 className='pt-5 pb-12 text-2xl font-semibold' >Reset Your Account</h1>,
        <EmailInput className='mb-8' value={email} setValue={setEmail} error={error} />,
        <SubmitButton />,
        <h1 className='mt-3'>Remember your password? <Link href='/login' >Sign In</Link> </h1>
    ]

    return (
        success ? <h1>{success}</h1> : <Form elements={formElements} />
    )
}