import { Image } from "@nextui-org/react"
import FollowButton from "./FollowButton"
import { Shelf } from "@/types"
import { followShelf, unfollowShelf } from "@/firebase/firestore"
import { useRouter } from "next/navigation"

export default function Card({ userId=null, loggedIn=false, shelf, updateShelf=()=>{} }: { userId: string | null, loggedIn?: boolean, shelf: Shelf, updateShelf?: Function }) {
    const router = useRouter();
    
    const date: { month: number, day: number, year: number } = {
        month: shelf.createdAt.toDate().getMonth(),
        day: shelf.createdAt.toDate().getDate(),
        year: shelf.createdAt.toDate().getFullYear(),
    }

    const handleFollowUnfollow = async () => {
        if (!userId) return console.error('No user id');
        if (shelf.following) {
            //unfollow
            const error = await unfollowShelf(userId, shelf);
            if (error) {
                console.error('Error unfollowing shelf', error);
                return;
            }
            updateShelf({ ...shelf, following: false, followers: shelf.followers - 1 })
        } else {
            //follow
            const error = await followShelf(userId, shelf);
            if (error) {
                console.error('Error following shelf', error);
                return;
            }
            updateShelf({ ...shelf, following: true, followers: shelf.followers + 1 })
        }
    }

    return (
        <div className='shadow-medium border p-4 w-full lg:w-11/12 h-[150px] flex flex-row justify-start my-1 hover:cursor-pointer hover:shadow-large transition-all'>
            <div className='flex flex-row w-full justify-between'>

                {/* Follower count  */}
                <div className='p-2 flex flex-col justify-evenly text-center items-center'> 
                    {loggedIn && (shelf.createdById !== userId) && <FollowButton className='flex flex-row justify-center items-center rounded-full w-[35px] h-[35px] hover:cursor-pointer m-1' isFollowing={Boolean(shelf.following)} onClick={handleFollowUnfollow} />}
                    <p className={`${loggedIn ? 'text-xl' : 'text-2xl'}`} >{shelf.followers}</p>
                </div>

                {/* Title and Description */}
                <div className='flex flex-row items-center justify-start p-2 lg:p-4 w-1/2 lg:w-3/4 overflow-clip' onClick={() => router.push(`/explore/${shelf.shelfId}`)}>
                    {shelf.image && <Image src={shelf.createdByImage} alt='Shelf Image' />}
                    <div className='flex-col justify-center overflow-clip'>
                        <h1 className='font-light text-lg lg:text-2xl'>{shelf.name}</h1>
                        <h2 className='italic text-sm lg:text-lg font-light'>{shelf.description}</h2>
                    </div>
                </div>

                {/* Creation Information */}
                <div className='w-1/2 lg:w-1/4 flex flex-col justify-between items-end text-end overflow-clip' onClick={() => router.push(`/explore/${shelf.shelfId}`)}>
                    <h3>{`${date.month}/${date.day}/${date.year}`}</h3>
                    <div className='flex flex-col lg:flex-row items-end'>
                        {shelf.createdByImage && <Image className='w-[30px] h-[30px] lg:mx-2' src={shelf.createdByImage} alt='User Image' />}
                        <h3>{shelf.createdByName}</h3>
                    </div>
                </div>
            </div>
        </div>
    )

}