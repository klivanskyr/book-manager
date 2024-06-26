'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase/firebase';

import { createNewUser } from '@/app/db/db';
import { TextInput, EmailInput, Form, ActionButton, LoadingButton, PasswordInput } from '@/app/components';
import Link from 'next/link';

export default function Signup() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');
    const [usernameError, setUsernameError] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');
    const router = useRouter();

    function validateInputs(): boolean {
        if (password.length < 8) {
            setPasswordError('Password must be at least 8 characters');
            return false;
        }
        if (password.length > 35) {
            setPasswordError('Password must be less than 35 characters');
            return false;
        }
        if (username.length < 3) {
            setUsernameError('Username must be at least 3 characters');
            return false;
        }
        if (username.length > 35) {
            setUsernameError('Username must be less than 35 characters');
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
            setEmailError('Please enter a valid email');
            return false;
        }
        return true;
    }

    const handleSubmit = async () => {
        setIsLoading(true);
        if (!validateInputs()) {
            setIsLoading(false);
            return;
        }
        createUserWithEmailAndPassword(auth, email, password) // Create user in Firebase Auth
        .then((userCredential) => {
            createNewUser(userCredential.user.uid, username, email, password) //Create user in database
            .then(() => {
                setIsLoading(false);
                router.push('/login');
            })
            .catch((error) => {
                setEmailError('Error creating database user');
                setIsLoading(false);
                setUsername('');
                setEmail('');
                setPassword('');
                console.error('Error creating database user: ', error);
            });
        })
        .catch((error) => {
            setEmailError('Email already has auth account');
            setIsLoading(false);
            setUsername('');
            setEmail('');
            setPassword('');
        });
    }

    function SubmitButton() {
        const className = 'mt-4 mb-2 w-64';
        return (
            isLoading 
            ? <LoadingButton className={className} color="primary" isLoading={isLoading} /> 
            : <ActionButton className={className} disabled={isLoading} text='Sign Up' onClick={handleSubmit} />
        )
    }

    const formElements = [
        <h1 className='pt-5 pb-8 text-2xl font-semibold'>Create an account</h1>,
        <TextInput className="my-1.5 shadow-sm rounded-md" disabled={isLoading} label='Username' value={username} setValue={setUsername} error={usernameError} />,
        <EmailInput className="my-1.5 shadow-sm rounded-md" disabled={isLoading} value={email} setValue={setEmail} error={emailError} />,
        <PasswordInput className="my-1.5 shadow-sm rounded-md" disabled={isLoading} value={password} setValue={setPassword} error={passwordError} />,
        <SubmitButton />,
        <div className='py-5 text-center'> Already have an account? <Link className='font-semibold text-lg text-blue-500' href='/login'>Sign In</Link></div>
    ];

    return (
        <div>
            <Form elements={formElements} />
        </div>
    )
}