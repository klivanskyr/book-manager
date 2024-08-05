'use client';

import { useState, useEffect } from "react";

import { Book, Shelf } from "@/types";
import { getUserShelves } from "@/firebase/firestore";
import { Image, ScrollShadow, Spinner, Textarea } from "@nextui-org/react";
import Stars from "./Stars";



export default function AllBookReview({ userId, book }: { userId: string, book: Book }) {
    const [shelves, setShelves] = useState<Shelf[] | null>(null);
    const [activeReview, setActiveReview] = useState<Book | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchShelves = async () => {
        const shelves = await getUserShelves(userId, 'owned');
        if (!shelves) {
            console.error('No shelves found');
            return;
        }
        setShelves(shelves);
    }

    useEffect(() => {   
        setIsLoading(true);
        fetchShelves().then(() => setIsLoading(false));
    }, []);

    function handleClick(book: Book) {
        setActiveReview(book);
    }

    function ReviewSelect({ shelves }: { shelves: Shelf[] | null }) {
        if (!shelves) {
            return (
                <div>
                    <h1>Loading...</h1>
                </div>
            )
        }

        const reviews = shelves.map((shelf: Shelf) => {
            const review = shelf.books.find(b => b.isbn === book.isbn);
            if (review) {
                return (
                    <div tabIndex={0} className={`shadow-md p-2 my-1.5 w-full rounded-md cursor-pointer border-2 ${activeReview === review && 'border-blue-300'}`} key={shelf.shelfId} onClick={() => handleClick(review)}>
                        <div className='flex flex-row'>
                            {shelf.image && <Image src={shelf.image} alt="Shelf Image"/>}
                            <div className='flex flex-col'>
                                <h1>{shelf.name}</h1>
                                <h2>Shelf Followers: {shelf.followers}</h2>
                            </div>
                        </div>
                    </div>
                )
            }
        })

        return (
            <div className='flex flex-col justify-center items-center w-full m-1 my-2 overflow-y-auto'>
                <h1 className='text-center lg:text-left text-lg lg:text-base w-full border-b-2'>Reviews</h1>
                <div className="w-full px-1 my-1 flex flex-col items-center justify-center">{reviews}</div>
            </div>
        )
    }

    function ReviewView({ book }: { book: Book | null }) {
        if (!book) {
            return (
                <div className="h-full flex flex-row justify-center items-center shadow-medium rounded-md p-4">
                    Select a review to view
                </div>
            )
        }

        return (
            <div className="h-full flex flex-row shadow-medium rounded-md lg:p-4 overflow-y-scroll">
                <div className="flex flex-col justify-center items-center mx-1 text-center">
                    <Image src={book.coverUrl} alt={book.title} width={200} height={250} />
                    <h2 className="mt-2 font-semibold text-sm lg:text-base">Title: <span className='font-normal'>{book.title}</span></h2>
                    <h2 className='py-1 font-semibold text-sm lg:text-base'>Author: <span className='font-normal'>{book.author}</span></h2>
                </div>
                <div className="flex flex-col justify-between h-full py-16 px-2 items-center w-full">
                    <div className="relative w-full h-full">
                        <div className="w-full h-full bg-gradient-to-b from-transparent to-transparent bg-no-repeat" style={{ backgroundSize: '100% 1.5rem', backgroundImage: 'linear-gradient(to bottom, transparent calc(100% - 1px), #a2d4fa 1px)' }}>
                            {book.review}
                        </div>
                        <div className="absolute inset-0 pointer-events-none" style={{ backgroundSize: '100% 1.5rem', backgroundImage: 'linear-gradient(to bottom, transparent calc(100% - 1px), #a2d4fa 1px)' }}></div>
                    </div>
                    <Stars className="flex flex-row m-2" size={25} book={book} disabled={true} userId={''} shelfId={''} handleUpdate={() => {}} />
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col-reverse lg:flex-row items-center justify-center w-full h-screen">
            {isLoading 
                ? <div  className="flex flex-row justify-center items-center w-full h-full"><Spinner size='lg' color='primary' /></div>
                : 
                <>
                    <div className='w-full lg:w-1/2 h-2/5 lg:h-full mx-2 overflow-x-hidden overflow-y-scroll lg:overflow-x-hidden lg:overflow-y-hidden p-4'>
                        <ReviewSelect shelves={shelves}/>
                    </div>
                    <div className='w-full lg:w-1/2 h-3/5 mx-2 overflow-hidden'>
                        <ReviewView book={activeReview}/>
                    </div> 
                </>
            }
        </div>
    )
}