'use client';

import { useEffect, useState } from 'react';

import { NavBarLMR, SideBar, SideBarSections, ExploreCardSmall } from '@/components';
import { UserProfile, ExploreIcon, Settings, Questionmark } from '@/assets';
import { Button, Link, Spinner } from '@nextui-org/react';
import { Book, Shelf } from '@/types';
import { auth, getAllPublicShelves, getUserShelves } from '@/firebase/firestore';
import { useRouter, useSearchParams } from 'next/navigation';
import { signOut } from 'firebase/auth';


export default function Explore() {
    const [shelves, setShelves] = useState<Shelf[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const router = useRouter();
    
    const searchParams = useSearchParams();
    const userId = searchParams.get('userId')


    const fetchShelves = async () => {
        // Get all public shelves
        const shelves = await getAllPublicShelves();
        if (!shelves) {
            console.error('No shelves found');
            return;
        }
        setShelves(shelves);

        // Check if user is logged in and get their followed shelves
        if (userId) {
            const followedShelves = await getUserShelves(userId, 'followed');
            if (!followedShelves) {
                console.error('No shelves found');
                return;
            }
            // Update shelves with followed status
            const updatedShelves = shelves.map((shelf) => {
                if (followedShelves.some((followedShelf) => followedShelf.shelfId === shelf.shelfId)) {
                    return { ...shelf, following: true };
                }
                return shelf;
            });
            setShelves(updatedShelves);

        }
    }

    useEffect(() => {
        setIsLoading(true);
        fetchShelves();
        setIsLoading(false);
    }, []);

    const handleUpdateShelf = (newShelf: Shelf) => {
        // client side update
        const newShelves = shelves.map((shelf) => shelf.shelfId === newShelf.shelfId ? newShelf : shelf);
        setShelves(newShelves);
    }

    const handleSignOut = async () => {
        await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/api/auth/logout`, {
            method: 'DELETE',
            cache: 'no-cache',
        });
        signOut(auth)
        .then(() => {
            router.push('/explore');
        })
        .catch((error) => {
            console.error(error);
        });
    }

    const leftNavElements = [
        <h1 className="font-medium text-lg text-center text-white">Book Manager</h1>,
    ];

    const middleNavElements = [
        <></>
    ];

    const rightNavElements = [
        (!userId ? <Button className='rounded-full text-white bg-slate-600 ' onClick={() => router.push('/login')}>Sign In</Button> : <></>),
        (userId ? <Button className="w-[100px] border-1.5 border-red-600 bg-white text-red-600 hover:bg-red-600 hover:text-white transition-all rounded-full h-12" onClick={handleSignOut}>Sign Out</Button> : <></>),
    ];

    const toImplement = 'text-red-600'
    const sideBarSections: SideBarSections = {
        "You": {
            "startContent": <UserProfile className='h-[30px] w-[40px]'/>,
            "subsections": [<Link href={userId ? `/dashboard/${userId}` : `/login?redirectUrl=/dashboard`}>Dashboard</Link>, <Link className={toImplement}>Recent</Link>, <Link className={toImplement}>Liked</Link>, <Link className={toImplement}>Saved</Link>]
        },
        "Explore": {
            "startContent": <ExploreIcon className='h-[37px] w-[40px]'/>,
            "subsections": [<Link className={toImplement}>Trending</Link>, <Link className={toImplement}>Books</Link>, <Link className={toImplement}>Authors</Link>, <Link className={toImplement}>Genres</Link>]
        },
        "Settings": {
            "startContent": <Settings className='h-[35px] w-[40px]'/>,
            "subsections": [<Link className={toImplement}>Profile</Link>, <Link className={toImplement}>Account</Link>, <Link className={toImplement}>Appearance</Link>, <Link className={toImplement}>Notifications</Link>],
        },
        "Help": {
            "startContent": <Questionmark className='h-[40px] w-[40px]'/>,
            "subsections": [<Link className={toImplement}>FAQ</Link>, <Link className={toImplement}>Contact Us</Link>, <Link className={toImplement}>Report a Bug</Link>, <Link className={toImplement}>Feedback</Link>]
        },
    };

    return (
        <>
            <NavBarLMR className='w-auto flex justify-between h-16 p-4 border bg-slate-700' leftElements={leftNavElements} middleElements={middleNavElements} rightElements={rightNavElements} />
            <div className='flex flex-row w-full h-full'>
                <SideBar sections={sideBarSections} />
                <div className='w-full h-full flex flex-col items-center justify-center p-4'>
                    {isLoading 
                        ? <div className='w-full h-full flex flex-row items-center justify-center'><Spinner size='lg' /></div>
                        : shelves.map((shelf, index) => <ExploreCardSmall shelf={shelf} userId={userId} loggedIn={Boolean(userId)} key={`${shelf.shelfId}${index}`} updateShelf={handleUpdateShelf}/>)}
                </div>
            </div>
        </>
    )
}