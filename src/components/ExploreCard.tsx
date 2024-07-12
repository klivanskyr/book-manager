import { Image } from "@nextui-org/react"
import FollowButton from "./FollowButton"
import { Shelf } from "@/types"

export default function Card({ loggedIn, shelf }: { loggedIn: boolean, shelf: Shelf }) {
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