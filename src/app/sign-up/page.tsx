'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase/firebase';

import { createNewUser } from '@/app/db/db';
import { TextInput, EmailInput, Form, FormSubmitButton, LoadingButton, PasswordInput } from '@/app/components';
import Link from 'next/link';

export default function Signup() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const router = useRouter();

    function validateEmailandPassword(email: string, password: string): boolean {
        if (!email || !password) {
            setError('All fields are required');
            return false;
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return false;
        }
        if (password.length > 35) {
            setError('Password must be less than 35 characters');
            return false;
        }
        if (username.length < 3) {
            setError('Username must be at least 3 characters');
            return false;
        }
        if (username.length > 35) {
            setError('Username must be less than 35 characters');
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
            setError('Please enter a valid email');
            return false;
        }
        return true;
    }

    const handleSubmit = async () => {
        setIsLoading(true);
        if (!validateEmailandPassword(email, password)) {
            setIsLoading(false);
            return;
        }
        createUserWithEmailAndPassword(auth, email, password) // Create user in Firebase Auth
        .then((userCredential) => {
            createNewUser(userCredential.user.uid, username, email, password) //Create user in database
            .then(() => {
                //console.log(`User ${username} added successfully`);
                setIsLoading(false);
                router.push('/login');
            })
            .catch((error) => {
                setError('Error creating database user');
                setIsLoading(false);
                setUsername('');
                setEmail('');
                setPassword('');
                console.error('Error creating database user: ', error);
            });
        })
        .catch((error) => {
            setError('Email already has auth account');
            setIsLoading(false);
            setUsername('');
            setEmail('');
            setPassword('');
            console.log('Error creating auth user: ', error);

        });
    }

    function SubmitButton() {
        const className = 'mt-4 mb-2 w-64';
        return (
            isLoading 
            ? <LoadingButton className={className} color="primary" isLoading={isLoading} /> 
            : <FormSubmitButton className={className} disabled={isLoading} text='Sign Up' onSubmit={handleSubmit} />
        )
    }
    
    function ErrorElement() {
        return error ? <div>{error}</div> : <></>
    }

    const formElements = [
        <h1 className='pt-5 pb-8 text-2xl font-semibold'>Create an account</h1>,
        <TextInput className="my-1.5 shadow-sm rounded-md" disabled={isLoading} label='Username' value={username} setValue={setUsername} />,
        <EmailInput className="my-1.5 shadow-sm rounded-md" disabled={isLoading} value={email} setValue={setEmail} />,
        <PasswordInput className="my-1.5 shadow-sm rounded-md" disabled={isLoading} value={password} setValue={setPassword} />,
        <SubmitButton />,
        <ErrorElement />,
        <div className='py-5 text-center'> Already have an account? <Link className='font-semibold text-lg text-blue-500' href='/login'>Sign In</Link></div>
    ];

    return (
        <div>
            <Form elements={formElements} />
        </div>
    )
}