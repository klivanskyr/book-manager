'use client'; 

import { useState, useContext, ReactElement, useEffect } from 'react';
import Link from 'next/link';
import { onValue, ref } from 'firebase/database';
import { useRouter } from 'next/navigation';

import { EmailInput, PasswordInput, ActionButton, SignInWithGoogleButton, LoadingButton } from '@/app/components';
import { loadBooks } from '../db';
import { database } from '@/firebase/firebase';
import { User, UserContext } from '../types/UserContext';
import { Form } from '../components';

export default function Login(): ReactElement {
  const { user, setUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    if (email) {
      setEmailError('');
    }
    if (password) {
      setPasswordError('');
    }
  }, [email, password]);

  function emailIsValid(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async function handleSubmit() {
    setIsLoading(true);
    if (!email) {
      setIsLoading(false);
      setEmailError('Email is required');
      return;
    }
    if (!password) {
      setIsLoading(false);
      setPasswordError('Password is required');
      return;
    }
    if (!emailIsValid(email)) {
      setIsLoading(false);
      setEmailError('Invalid email');
      setEmail('');
      setPassword('');
      return;
    }

    await validateEmailandPassword(email, password);
  }

  const validateEmailandPassword = async (email: string, password: string) => {
    if (!email || !password) {
      setEmailError('All fields are required');
      setIsLoading(false);
      return;
    }

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      cache: 'no-cache',
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.code !== 200) {
      setPasswordError(data.message);
      setIsLoading(false);
      return;
    }

    const userBooksRef = ref(database, `usersBooks/${data.userId}`);
    onValue(userBooksRef, async (userBooksSnapshot) => { //listens for realtime updates
      const books = await loadBooks(userBooksSnapshot);
      console.log('books', books);
      const updatedUser: User = {
          user_id: data.userId,
          books
      };
      setUser(updatedUser);
      router.push(`/dashboard/${data.userId}`)
    });
  }
  
  function SubmitButton() {
    const className = 'mt-1 mb-2 w-64 h-12';
    return isLoading 
      ? <LoadingButton className={className} color="primary" isLoading={isLoading} /> 
      : <ActionButton className={className} disabled={isLoading} text='Sign In' onClick={handleSubmit} />
  }

  const formElements = [
    <h1 className='pt-5 pb-16 text-2xl font-semibold'>Sign in to your account</h1>,
    <EmailInput className="my-1.5 shadow-sm rounded-md" disabled={isLoading} value={email} setValue={setEmail} error={emailError} />,
    <PasswordInput className="my-1.5 shadow-sm rounded-md" disabled={isLoading} value={password} setValue={setPassword} error={passwordError} />,
    <Link href='#' className='px-2 pb-2 pt-6 text-blue-500 font-medium text-sm'>Forgot Password</Link>,
    <SubmitButton />,
    <SignInWithGoogleButton className='bg-green-400 w-64 h-12 mb-2' disabled={isLoading} />,
    <div className='py-5 text-center'> Dont have an account? <Link className='font-semibold text-lg text-blue-500' href='/sign-up'>Sign up</Link></div>
  ];

  return (
    <Form elements={formElements} />
  );
}