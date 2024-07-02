'use client'; 

import { useState, useContext, ReactElement } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { EmailInput, PasswordInput, ActionButton, LoadingButton } from '@/app/components';
import { UserContext } from '../types/UserContext';
import { Form } from '../components';
import emailIsValid from '../utils/emailIsValid';

export default function Login(): ReactElement {
  const { user, setUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [input, setInput] = useState({ email: '', password: '' });
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const handleSubmit = async () => {
    setIsLoading(true);
    if (!input.email || !input.password) {
      setIsLoading(false);
      setError('All fields are required');
      return;
    }

    if (!emailIsValid(input.email)) {
      setIsLoading(false);
      setError('Invalid email');
      return;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      cache: 'no-cache',
      body: JSON.stringify({ ...input, createdWith: 'email' })
    });

    const data = await res.json();
    if (data.code !== 200) {
      setError(data.message);
      setIsLoading(false);
      return;
    }

      setUser({
        user_id: data.uid,
        books: user ? user.books : null,
        shownBooks: []
      });
      setIsLoading(false);
      router.push(`/dashboard/${data.uid}`);
  }
  
  function SubmitButton() {
    const className = 'mt-1 mb-2 w-64 h-12';
    return isLoading 
      ? <LoadingButton className={className} color="primary" isLoading={isLoading} /> 
      : <ActionButton className={className} disabled={isLoading} text='Sign In' onClick={handleSubmit} />
  }

  const formElements = [
    <h1 className='pt-5 pb-16 text-2xl font-semibold'>Sign in to your account</h1>,
    <EmailInput className="max-w-[500px] my-1.5 shadow-sm rounded-md" disabled={isLoading} value={input.email} setValue={(newValue: string) => setInput({ ...input, email: newValue })} />,
    <PasswordInput className="max-w-[500px] my-1.5 shadow-sm rounded-md" disabled={isLoading} value={input.password} setValue={(newValue: string) => setInput({ ...input, password: newValue })} />,
    <Link href='/reset' className='px-2 pb-2 pt-6 text-blue-500 font-medium text-sm'>Forgot Password</Link>,
    <SubmitButton />,
    // <SignInWithGoogleButton className='bg-green-400 w-64 h-12 mb-2' disabled={isLoading} />,
    <div className='py-5 text-center'> Dont have an account? <Link className='font-semibold text-lg text-blue-500' href='/sign-up'>Sign up</Link></div>
  ];

  return (
    <Form elements={formElements} />
  );
}