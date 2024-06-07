'use client';

import React, { useState, useEffect, ReactElement } from 'react';
import Image from 'next/image';
import { FaTimes } from 'react-icons/fa'
import ColorThief from 'colorthief'
import { motion } from "framer-motion"
import { Oval } from 'react-loader-spinner';

import Review from './Review';
import Stars  from '../Shelf/Stars'
import { coverPlaceholder } from '@/assets'

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
    bgLoaded: boolean,
    imgLoaded: boolean,
    selected: boolean,
};


export function BookCard({ book, handleRemoveBook, handleRatingUpdate, handleReviewUpdate, handleBgLoaded}: 
    { book: Book, handleRemoveBook: Function, handleRatingUpdate: Function, handleReviewUpdate: Function, handleBgLoaded: Function }): ReactElement {

    const [reviewVisable, setReviewVisable] = useState(false);

    function handleReviewClose(newReview: string): void {
        setReviewVisable(false);
        handleReviewUpdate(book, newReview);
    }

    //API call to find background color using Color Thief
    async function fetchDominantColor({ book }: { book: Book }): Promise<void> {
        const colorThief = new ColorThief();
        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.src = book.coverImage;

        img.onload = function () {
            try {
                const color = colorThief.getColor(img);
                console.log('success color grab');
                handleBgLoaded(book, [Math.min(color[0]+75, 255), Math.min(color[1]+75, 255), Math.min(color[2]+75, 255)]);
            } catch (error) {
                console.log('error color grab');
                handleBgLoaded(book, [127, 127, 127]);
            }  
        }
    }

    useEffect(() => {
        if (!book.bgLoaded) {
            console.log("fetching color");
            fetchDominantColor({ book });
        }
    }, [book]);

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

