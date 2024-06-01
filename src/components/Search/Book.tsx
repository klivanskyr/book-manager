import react, { useState, useEffect, ReactElement } from 'react';
import Image from 'next/image';
import { FaTimes } from 'react-icons/fa'
import ColorThief from 'colorthief'
import { motion } from "framer-motion"
import Review from './Review';
import Stars from './Stars'

export type Book = {
    key: string,
    title: string,
    author: string,
    review: string,
    rating: number
    isbn: string,
    coverImage: string,
    bgColor: number[],
    bgLoaded: boolean,
    selected: boolean,
};


export const BookCard = ({ 
    book, 
    booksIndex, 
    handleRemoveBook, 
    handleRatingUpdate, 
    handleBgLoaded,
    handleReviewUpdate }:
    { 
        book:Book, 
        booksIndex: number,
        handleRemoveBook: Function,
        handleRatingUpdate: Function,
        handleBgLoaded: Function,
        handleReviewUpdate: Function }):
    ReactElement => {

    const [reviewVisable, setReviewVisable] = useState(false);

    const handleClick = () => {
        setReviewVisable(true);
    }

    const handleReviewClose = (newReview: string) => {
        setReviewVisable(false);
        book.review = newReview;
        handleReviewUpdate(book, book.rating - 1);
    }

    //API call to find background color using Color Thief
    useEffect(() => {
        const fetchDominantColor = async () => {
            const colorThief = new ColorThief();
            const img = new window.Image();
            img.crossOrigin = 'anonymous';
            img.src = book.coverImage;

            img.onload = function () {
                const color = colorThief.getColor(img);
                book.bgColor = [Math.min(color[0]+75, 255), Math.min(color[1]+75, 255), Math.min(color[2]+75, 255)];
                book.bgLoaded = true;
                handleBgLoaded(book, booksIndex);
            };
        };
        
        fetchDominantColor();
    }, [book.bgLoaded]);

    return (
        <>
            <Review active={reviewVisable} book={book} handleReviewClose={handleReviewClose} handleRatingUpdate={handleRatingUpdate} />
            <motion.div 
                style={{ backgroundColor: `rgb(${book.bgColor[0]}, ${book.bgColor[1]}, ${book.bgColor[2]})` }}
                className={`select-none h-[375px] w-auto py-2 px-3 m-3 flex-col rounded-2xl shadow-lg ${book.bgLoaded ? 'opacity-100' : 'opacity-0'} cursor-pointer`}  
                whileHover={{ scale: 1.05 }}
            >
                <FaTimes color={book.bgColor[0] > 150 && book.bgColor[1] < 100 && book.bgColor[2] < 100 ? '#2e2e2e' : '#d40000' } onClick={() => handleRemoveBook(book)} />
                <div onClick={() => handleClick()}>
                    <div className='h-full w-full'>
                        <Image
                            className='m-auto mt-2 h-[200px] w-full object-contain rounded-sm max-w-64 pb-2'
                            src={book.coverImage} 
                            alt={book.title}
                            width={200}
                            height={200}
                            sizes=''
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

