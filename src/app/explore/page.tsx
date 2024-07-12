'use client';

import { useEffect, useState } from 'react';

import { NavBarLMR, SideBar, SideBarSections, FollowButton } from '@/components';
import { UserProfile, ExploreIcon, Settings, Questionmark } from '@/assets';
import { Button, Spinner, Image } from '@nextui-org/react';
import { Book, Shelf } from '@/types';
import { Check, Plus } from '@/assets';
import { getAllPublicShelves, getUserShelves } from '@/firebase/firestore';import { useRouter } from 'next/navigation';
;


function Card({ loggedIn, shelf }: { loggedIn: boolean, shelf: Shelf }) {
    const date: { month: number, day: number, year: number } = {
        month: shelf.createdAt.toDate().getMonth(),
        day: shelf.createdAt.toDate().getDate(),
        year: shelf.createdAt.toDate().getFullYear(),
    }

    return (
        <div className='shadow-medium border p-4 w-11/12 flex flex-row justify-start my-1'>
            <div className='flex flex-row w-full justify-between'>
                <div className='p-6 flex flex-col justify-evenly text-center items-center'> 
                    {loggedIn && <FollowButton className='flex flex-row justify-center items-center border rounded-full w-[50px] h-[50px] hover:cursor-pointer m-1' isFollowing={true} onClick={() => {}} />}
                    <p className={`m-1 ${loggedIn ? 'mt-4 text-xl' : 'text-2xl'}`} >{shelf.followers}</p>
                </div>
                <div className='flex flex-row items-center justify-start p-4 w-3/4'>
                    {shelf.image && <Image src={shelf.createdByImage} alt='Shelf Image' />}
                    <div className='flex-col justify-center'>
                        <h1 className='font-light text-2xl'>{shelf.name}</h1>
                        <h2 className='italic text-lg font-light'>{shelf.description}</h2>
                    </div>
                </div>
                <div className='w-1/4 flex flex-col justify-between items-end text-end'>
                    <h3>{`Created: ${date.month}/${date.day}/${date.year}`}</h3>
                    <div className='flex flex-row'>
                        <h3>{`Author: ${shelf.createdByName}`}</h3>
                        {shelf.createdByImage && <Image src={shelf.createdByImage} alt='User Image' />}
                    </div>
                </div>
            </div>
        </div>
    )

}

function Body({ isLoading, loggedIn, shelves }: { isLoading: boolean, loggedIn: boolean, shelves: Shelf[] }) {
    return (
        <div className='w-full h-full flex flex-col items-center justify-center p-4'>
            {isLoading 
                ? <div className='w-full h-full flex flex-row items-center justify-center'><Spinner size='lg' /></div>
                : shelves.map((shelf, index) => <Card shelf={shelf} loggedIn={loggedIn} key={`${shelf.shelfId}${index}`} />)}
        </div>
    )
    

}

export default function ExploreLoggedOut() {
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
        <Button className='rounded-full text-white bg-slate-600 ' onClick={() => router.push('/login')}>Sign In</Button>
    ];

    const sideBarSections: SideBarSections = {
        "You": {
            "startContent": <UserProfile className='h-[30px] w-[40px]'/>,
            "subsections": ["Dashboard", "Recent", "Liked", "Saved"],
        },
        "Explore": {
            "startContent": <ExploreIcon className='h-[37px] w-[40px]'/>,
            "subsections": ["Trending", "Books", "Authors", "Genres"],
        },
        "Settings": {
            "startContent": <Settings className='h-[35px] w-[40px]'/>,
            "subsections": ["Profile", "Account", "Appearance", "Notifications"],
        },
        "Help": {
            "startContent": <Questionmark className='h-[40px] w-[40px]'/>,
            "subsections": ["FAQ", "Contact Us", "Report a Bug", "Feedback"]
        },
    };

    return (
        <>
            <NavBarLMR className='w-auto flex justify-between h-16 p-4 border bg-slate-700' leftElements={leftNavElements} middleElements={middleNavElements} rightElements={rightNavElements} />
            <div className='flex flex-row w-full h-full'>
                <SideBar sections={sideBarSections} />
                <Body isLoading={isLoading} loggedIn={false} shelves={shelves}/>
            </div>
        </>
    )
}