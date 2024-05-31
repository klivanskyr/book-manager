import react, { useState, useEffect, ReactElement } from 'react';
import Image from 'next/image';
import { FaTimes } from 'react-icons/fa'
import ColorThief from 'colorthief'
import { motion } from "framer-motion"
import Review from './Review';
import Stars from './Stars'

export type Book = { 
    title: string,
    author: string,
    review: string,
    isbn: string,
    coverImage: string,
    bgColor: number[],
    rating: number
    bgLoaded: boolean,
};


export const BookCard = ({ book, handleRemoveBook, handleRatingUpdate, handleBgLoaded, i }: { book:Book, handleRemoveBook: Function, handleRatingUpdate: Function, handleBgLoaded: Function, i: number }): ReactElement => {

    const [reviewVisable, setReviewVisable] = useState(false);

    const handleClick = () => {
        setReviewVisable(true);
    }

    const handleReviewClose = (newReview: string) => {
        setReviewVisable(false);
        book.review = newReview;
        localStorage.setItem(`${book.isbn}`, JSON.stringify(book));
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
                handleBgLoaded(book, i);
            };
        };
        
        fetchDominantColor();
    }, [book.bgLoaded]);

    return (
        <>
            <Review active={reviewVisable} book={book} handleReviewClose={handleReviewClose} handleRatingUpdate={handleRatingUpdate} />
            <motion.div 
                style={{ backgroundColor: `rgb(${book.bgColor[0]}, ${book.bgColor[1]}, ${book.bgColor[2]})` }}
                className={`select-none h-full w-auto py-2 px-3 m-3 flex-col rounded-2xl shadow-lg ${book.bgLoaded ? 'opacity-100' : 'opacity-0'} cursor-pointer`}  
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

