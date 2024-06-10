'use client';

import React, { useState, useEffect, ReactElement } from 'react';
import Image from 'next/image';
import { FaTimes } from 'react-icons/fa'
import { motion } from "framer-motion"
import { Oval } from 'react-loader-spinner';

import Review from './Review';
import Stars  from '../Shelf/Stars'
import { coverPlaceholder } from '@/assets'
import { Userinfo, updateBook, updateReview, deleteBook } from '@/app/Manager/Userinfo'

export type Book = {
    id: number,
    key: string,
    title: string,
    author: string,
    review: string,
    rating: number
    isbn: string,
    coverImage: string,
    bgColor: number[],
    imgLoaded: boolean,
    selected: boolean,
};


export function BookCard({ user, book }: { user: Userinfo, book: Book }): ReactElement {
    const [reviewVisable, setReviewVisable] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    function handleReviewClose(newReview: string): void {
        setReviewVisable(false);
        handleReviewUpdate(book, newReview);
    }

    // Update star/rating amount
    async function handleRatingUpdate(book: Book, starIndex: number): Promise<void> {
        if (book.rating == starIndex + 1){
            book.rating = 0; //Clicking same star twice removes rating
        } else {
            book.rating = starIndex + 1;
        }
        await updateReview(book, user.user_id);
    };

    async function handleReviewUpdate(book: Book, newReview: string): Promise<void> {
        const newBook = {...book, review: newReview};
        await updateReview(newBook, user.user_id);
    }

    //Clear Books handler
    async function handleRemoveBook(book: Book): Promise<void> {
        await deleteBook(book.id, user.user_id);
    }

    //handle Background color loading from color thief
    function handleBgLoaded(book: Book, color: number[]): void {
        const updatedBook = {...book, bgColor: color, bgLoaded: true};
        updateBook(user, updatedBook);
    }

    return (
        <>
            <Review active={reviewVisable} book={book} handleReviewClose={handleReviewClose} handleRatingUpdate={handleRatingUpdate} />
            {!book.bgLoaded ? 
                <Oval color='#2e2e2e' height={50} width={50} /> :
                <motion.div 
                    style={{ backgroundColor: `rgb(${book.bgColor[0]}, ${book.bgColor[1]}, ${book.bgColor[2]})` }}
                    className={`select-none h-[375px] w-auto py-2 px-3 m-3 flex-col rounded-2xl shadow-lg ${book.bgLoaded ? 'opacity-100' : 'opacity-0'} cursor-pointer`}  
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
            }
        </>
    )
}

