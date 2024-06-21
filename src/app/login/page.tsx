'use client'; 

import { useState, useContext, ReactElement } from 'react';
import Link from 'next/link';
import { compare } from 'bcrypt-ts';
import { onValue, ref } from 'firebase/database';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';

import { EmailInput, PasswordInput, FormSubmitButton, SignInWithGoogleButton, LoadingButton } from '@/app/components';
import { getUserByEmail, loadBooks } from '../db';
import { auth, database } from '@/firebase/firebase';
import { User, UserContext } from '../types/UserContext';
import { Form } from '../components';

export default function Login(): ReactElement {
  const { user, setUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();

  const validateEmailandPassword = async (email: string, password: string) => {
    if (!email || !password) {
      setError('All fields are required');
      setIsLoading(false);
      return;
    }

    const userObj = await getUserByEmail(email);
    if (!userObj) {
        setError('User not found');
        setIsLoading(false);
        return;
    }

    if (!userObj.password) {
        setError('User signed in with Google. Please sign in with Google.')
        setIsLoading(false);
        return;
    }

    if (await compare(password, userObj.password)) {
        //console.log('correct password');

        const userBooksRef = ref(database, `usersBooks/${userObj.id}`);
        onValue(userBooksRef, async (userBooksSnapshot) => { //listens for realtime updata
            const books = await loadBooks(userBooksSnapshot);
            const updatedUser: User = {
                user_id: userObj.id,
                books
            };
            //console.log('updated user', updatedUser);
            setUser(updatedUser);
        });

        //sign in user for auth
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            setIsLoading(false);
            router.push(`/dashboard/${userObj.id}`)
            return;
        })
        .catch((error) => {
            console.error('Error signing in user for auth: ', error);
            setError('Error signing in user');
            setIsLoading(false);
            return;
        });

    } else {
        setError('Incorrect password');
        setIsLoading(false);
        setUser(null);
        return;
    }
}

  function emailIsValid(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async function handleSubmit() {
    setIsLoading(true);
    if (!emailIsValid(email)) {
      setIsLoading(false);
      setError('Invalid email');
      setEmail('');
      setPassword('');
      return;
    }

    await validateEmailandPassword(email, password);

    if (error) {
      setEmail('');
      setPassword('');
      return
    }
  }
  
  function SubmitButton() {
    const className = 'mt-1 mb-2 w-64';
    return isLoading 
      ? <LoadingButton className={className} color="primary" isLoading={isLoading} /> 
      : <FormSubmitButton className={className} disabled={isLoading} text='Sign In' onClick={handleSubmit} />
  }

  function ErrorElement() {
    return error ? <div>{error}</div> : <></>
  }

  const formElements = [
    <h1 className='pt-5 pb-16 text-2xl font-semibold'>Sign in to your account</h1>,
    <EmailInput className="my-1.5 shadow-sm rounded-md" disabled={isLoading} value={email} setValue={setEmail} />,
    <PasswordInput className="my-1.5 shadow-sm rounded-md" disabled={isLoading} value={password} setValue={setPassword} />,
    <Link href='#' className='px-2 pb-2 pt-6 text-blue-500 font-medium text-sm'>Forgot Password</Link>,
    <SubmitButton />,
    <SignInWithGoogleButton className='bg-green-400 w-64 mb-2' disabled={isLoading} />,
    <ErrorElement />,
    <div className='py-5 text-center'> Dont have an account? <Link className='font-semibold text-lg text-blue-500' href='/sign-up'>Sign up</Link></div>
  ];

  return (
    <Form elements={formElements} />
  );
}