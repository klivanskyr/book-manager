'use client';

import React, { useState, useContext, ReactElement } from 'react';
import Image from 'next/image';
import { FaTimes } from 'react-icons/fa'
import { motion } from "framer-motion"

import Review from './Review';
import Stars  from '../Shelf/Stars'
import { Book } from '@/app/types/Book';
import { coverPlaceholder } from '@/assets'
import { UserContext, User, loadBooks, updateReview, deleteBook } from '@/app/UserContext'


export function Card({ book }: { book: Book }): ReactElement {
    const [reviewVisable, setReviewVisable] = useState(false);
    const { user, setUser } = useContext(UserContext);

    async function handleReviewClose(newReview: string): Promise<void> {
        setReviewVisable(false);
        const newBook = {...book, review: newReview};
        if (user) { await updateReview(newBook, user.user_id); } //IF USER
    }

    // Update star/rating amount
    async function handleRatingUpdate(book: Book, starIndex: number): Promise<void> {
        if (book.rating == starIndex + 1){
            book.rating = 0; //Clicking same star twice removes rating
        } else {
            book.rating = starIndex + 1;
        }
        if (user) { 
            await updateReview(book, user.user_id);
            const res = await loadBooks(user.user_id);
            const userUpdatedBook: User = { 
                user_id: user.user_id,
                books: res
            };
            setUser(userUpdatedBook);
        } //IF USER
    };

    //Clear Books handler
    async function handleRemoveBook(book: Book): Promise<void> {
        if (user) {
            await deleteBook(book.id, user.user_id);
            const res = await loadBooks(user.user_id); 
            const userRemovedBook: User = { 
                user_id: user.user_id,
                books: res
            };
            setUser(userRemovedBook);
        };
    }

    return (
        <>
            <Review active={reviewVisable} book={book} handleReviewClose={handleReviewClose} handleRatingUpdate={handleRatingUpdate} /> 
            <motion.div 
                style={{ backgroundColor: `rgb(${book.bgColor[0]}, ${book.bgColor[1]}, ${book.bgColor[2]})` }}
                // ${book.bgLoaded ? 'opacity-100' : 'opacity-0'}
                className={`select-none h-[375px] w-auto py-2 px-3 m-3 flex-col rounded-2xl shadow-lg cursor-pointer`}  
                whileHover={{ scale: 1.05 }}
            >
                <FaTimes color={book.bgColor[0] > 150 && book.bgColor[1] < 100 && book.bgColor[2] < 100 ? '#2e2e2e' : '#d40000' } onClick={() => handleRemoveBook(book)} />
                <div onClick={() => setReviewVisable(true)}>
                    <div className='h-full w-full'>
                        <Image
                            className='m-auto mt-2 h-[200px] w-full object-contain rounded-sm max-w-64 pb-2'
                            src={book.coverImage} 
                            alt={book.title}
                            placeholder='blur'
                            blurDataURL={coverPlaceholder.src}
                            width={200}
                            height={200}
                            priority={true}
                        />
                    </div>
                    <div className='h-full flex-col flex-auto justify-end items-end text-center mx-2'>
                        <h2 className='font-bold'>{book.title}</h2>
                        <h3 className='font-medium'>{`Author: ${book.author}`}</h3>
                        <p>ISBN: {book.isbn}</p>
                    </div>
                </div>
                <Stars size={15} book={book} handleRatingUpdate={handleRatingUpdate} />
            </motion.div>
        </>
    )
}

