'use client';

import React, { useState, useContext, ReactElement } from 'react';
import Image from 'next/image';
import { FaTimes } from 'react-icons/fa'
import { motion } from "framer-motion"

import Review from './Review';
import Stars  from '../Shelf/Stars'
import { Book } from '@/app/types/Book';
import { coverPlaceholder } from '@/assets'
import { UserContext } from '@/app/types/UserContext'
import { removeBookFromUser } from '@/app/db/db';


export function Card({ book }: { book: Book }): ReactElement {
    const [reviewVisable, setReviewVisable] = useState(false);
    const { user, setUser } = useContext(UserContext);

    async function handleReviewClose(newReview: string): Promise<void> {
        setReviewVisable(false);
    }

    //Clear Books handler
    async function handleRemoveBook(book: Book): Promise<void> {
        if (user) {
            await removeBookFromUser(book.id, user.user_id);
        };
    }

    return (
        <>
            <Review active={reviewVisable} book={book} handleReviewClose={handleReviewClose} /> 
            <motion.div 
                style={{ backgroundColor: `rgb(${book.bgColor.r}, ${book.bgColor.g}, ${book.bgColor.b})` }}
                // ${book.bgLoaded ? 'opacity-100' : 'opacity-0'}
                className={`select-none h-[375px] w-auto py-2 px-3 m-3 flex-col rounded-2xl shadow-lg cursor-pointer`}  
                whileHover={{ scale: 1.05 }}
            >
                <FaTimes color={book.bgColor.r > 150 && book.bgColor.g < 100 && book.bgColor.b < 100 ? '#2e2e2e' : '#d40000' } onClick={() => handleRemoveBook(book)} />
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
                <Stars size={15} book={book} />
            </motion.div>
        </>
    )
}

