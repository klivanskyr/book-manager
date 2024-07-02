'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { TextInput, EmailInput, Form, ActionButton, LoadingButton, PasswordInput } from '@/app/components';

export default function Signup() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [input, setInput] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState<string>('');
    const router = useRouter();

    function validateInputs(): boolean {
        if (input.password.length < 8) {
            setError('Password must be at least 8 characters');
            return false;
        }
        if (input.password.length > 35) {
            setError('Password must be less than 35 characters');
            return false;
        }
        if (input.username.length < 3) {
            setError('Username must be at least 3 characters');
            return false;
        }
        if (input.username.length > 35) {
            setError('Username must be less than 35 characters');
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)){
            setError('Please enter a valid email');
            return false;
        }
        return true;
    }

    const handleSubmit = async (e: any) => {
        setIsLoading(true);
        if (!validateInputs()) {
            setIsLoading(false);
            return;
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/api/auth/sign-up`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...input, createdWith: 'email' })
        });
        const data = await res.json();
        setIsLoading(false);
        if (data.code !== 200) {
            const errorMessage = data.message;
            setInput({ username: '', email: '', password: '' })
            if (errorMessage.code === 'auth/email-already-in-use') {
                setError('Email already in use');
                return;
            }
            setError(errorMessage.code);
            return;
        } else {
            router.push('/login');
        }
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
        <TextInput className="max-w-[500px] my-1.5 shadow-sm rounded-md" radius='md' disabled={isLoading} label='Username' value={input.username} setValue={(newValue: string) => setInput({ ...input, username: newValue })} />,
        <EmailInput className="max-w-[500px] my-1.5 shadow-sm rounded-md" disabled={isLoading} value={input.email} setValue={(newValue: string) => setInput({ ...input, email: newValue })}  />,
        <PasswordInput className="max-w-[500px] my-1.5 shadow-sm rounded-md" disabled={isLoading} value={input.password} setValue={(newValue: string) => setInput({ ...input, password: newValue })} />,
        <SubmitButton />,
        <h2 className={`m-2 text-red-600 font-light text-xl ${error ? 'opacity-100' : 'opacity-0'}`} >{error}</h2>,
        <div className='py-5 text-center'> Already have an account? <Link className='font-semibold text-lg text-blue-500' href='/login'>Sign In</Link></div>
    ];

    return (
        <div>
            <Form elements={formElements} />
        </div>
    )
}