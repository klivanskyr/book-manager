'use client'; 

import { useState, ReactElement } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { EmailInput, PasswordInput, ActionButton, LoadingButton } from '@/components';
import { Form } from '../../components';
import emailIsValid from '../../utils/emailIsValid';

export default function Login(): ReactElement {
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

    const emailError = emailIsValid(input.email);
    if (emailError) {
      setIsLoading(false);
      setError(emailError);
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
      const message: string = data.message;
      console.log('message', message);
      if (message.includes('invalid-credential')) { setError('Invalid Credentials') }
      else if (message.includes('too-many-requests')) { setError('Too many requests, try again later')}
      else if (message.includes('user-not-found')) { setError('User not found') }
      else { setError(data.message) }
      setIsLoading(false);
      return;
    }
    
    setIsLoading(false);
    router.push(`/explore/${data.uid}`);
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
    <h2 className={`m-2 text-red-600 font-light text-xl ${error ? 'opacity-100' : 'opacity-0'}`} >{error}</h2>,
    // <SignInWithGoogleButton className='bg-green-400 w-64 h-12 mb-2' disabled={isLoading} />,
    <div className='py-5 text-center'> Dont have an account? <Link className='font-semibold text-lg text-blue-500' href='/sign-up'>Sign up</Link></div>
  ];

  return (
    <Form elements={formElements} />
  );
}