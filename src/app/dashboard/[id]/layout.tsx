'use client';

import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';

import { Navbar, ActionButton } from "@/app/components";
import { auth } from '@/firebase/firebase';
import { UserContext } from '@/app/types/UserContext';

export default function Layout({ children }: { children: React.ReactNode }) {

    const { user, setUser } = useContext(UserContext);
    const router = useRouter();

    function handleSignOut() {
        signOut(auth)
        .then(() => {
            setUser(null);
            router.push('/login');
        })
        .catch((error) => {
            console.error(error);
        });
    }

    const leftElements = [
        <h1 className="ml-4 font-Urbanist font-medium text-lg">Book Manager</h1>,
    ];

    const rightElements = [
        <ActionButton className='rounded-full h-12' onClick={() => <></>} text="Add Book" />,
        <ActionButton className="m-1 bg-red-500 rounded-full h-12" onClick={handleSignOut} text="Sign Out" />
    ];


    return (
        <div>
            <Navbar className='w-full flex justify-between h-16 bg-slate-50 shadow-medium' leftElements={leftElements} rightElements={rightElements} />
            {children}
        </div>
    )
}