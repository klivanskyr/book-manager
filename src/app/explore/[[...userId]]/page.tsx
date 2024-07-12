'use client';

import { useEffect, useState } from 'react';

import { NavBarLMR, SideBar, SideBarSections, ExploreCard } from '@/components';
import { UserProfile, ExploreIcon, Settings, Questionmark } from '@/assets';
import { Button, Link, Spinner } from '@nextui-org/react';
import { Book, Shelf } from '@/types';
import { getAllPublicShelves, getUserShelves } from '@/firebase/firestore';import { useRouter } from 'next/navigation';


export default function ExploreLoggedIn({ params }: { params: { userId?: string }}) {
    const [shelves, setShelves] = useState<Shelf[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const router = useRouter();

    const fetchShelves = async () => {
        setIsLoading(true);
        const shelves = await getAllPublicShelves();
        if (!shelves) {
            console.error('No shelves found');
            return;
        }
        setShelves(shelves);
        setIsLoading(false);
    }

    useEffect(() => {
        fetchShelves();
    }, []);

    const leftNavElements = [
        <h1 className="font-medium text-lg text-center text-white">Book Manager</h1>,
    ];

    const middleNavElements = [
        <h1 className='text-white'>Middle</h1>
    ];

    const rightNavElements = [
        (!params.userId ? <Button className='rounded-full text-white bg-slate-600 ' onClick={() => router.push('/login')}>Sign In</Button> : <></>),
    ];

    const toImplement = 'text-red-600'
    const sideBarSections: SideBarSections = {
        "You": {
            "startContent": <UserProfile className='h-[30px] w-[40px]'/>,
            "subsections": [<Link href={`/dashboard/${params.userId}`}>Dashboard</Link>, <Link className={toImplement}>Recent</Link>, <Link className={toImplement}>Liked</Link>, <Link className={toImplement}>Saved</Link>]
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
                        : shelves.map((shelf, index) => <ExploreCard shelf={shelf} loggedIn={Boolean(params.userId)} key={`${shelf.shelfId}${index}`} />)}
                </div>
            </div>
        </>
    )
}